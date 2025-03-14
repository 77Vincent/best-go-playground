import {useCallback, useRef, useState, ChangeEvent} from "react";
import {Button, DarkThemeToggle, Tooltip, useThemeMode} from "flowbite-react";
import AceEditor, {IMarker} from "react-ace";
import {Ace} from "ace-builds";
import {Resizable, ResizeDirection, NumberSize} from "re-resizable";
import {Link} from "react-router";
import {IoLanguage as LanguageIcon} from "react-icons/io5"

import {
    AUTO_RUN_KEY, CODE_CONTENT_KEY, CURSOR_COLUMN_KEY, CURSOR_ROW_KEY, CURSOR_UPDATE_DEBOUNCE_TIME,
    EDITOR_SIZE_KEY, FONT_SIZE_KEY, FONT_SIZE_L, FONT_SIZE_S, LINT_ON_KEY, RUN_DEBOUNCE_TIME,
    KEY_BINDINGS_KEY, FONT_SIZE_M, AUTO_RUN_DEBOUNCE_TIME
} from "../constants.ts";
import {ClickBoard, Divider, MyToast, Wrapper} from "./Common.tsx";
import {executeCodeStream, formatCode} from "../api/api.ts";

import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/theme-dawn";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/keybinding-vim"
import "ace-builds/src-noconflict/keybinding-emacs"
import "ace-builds/src-noconflict/ext-statusbar";
import "ace-builds/src-noconflict/ext-searchbox";
import {debounce} from "react-ace/lib/editorOptions";
import {
    getAutoRun,
    getCodeContent,
    getCursorColumn,
    getCursorRow,
    getKeyBindings,
    getEditorSize, getFontSize,
    getLintOn, mapFontSize, generateMarkers
} from "../utils.ts";
import Settings from "./Settings.tsx";
import {KeyBindings} from "../types";
import About from "./About.tsx";

export default function Component() {
    const {mode, toggleMode} = useThemeMode();
    const statusBarRef = useRef<HTMLDivElement | null>(null);

    const [showAbout, setShowAbout] = useState<boolean>(false);

    const [toastMessage, setToastMessage] = useState<string>("");

    // error state
    const [errorRows, setErrorRows] = useState<IMarker[]>([]);

    // settings
    const [fontSize, setFontSize] = useState<number>(getFontSize());
    const [editorSize, setEditorSize] = useState<number>(getEditorSize())

    // editor status
    const [isFormatting, setIsFormatting] = useState<boolean>(false)
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [code, setCode] = useState<string>(getCodeContent());
    const [result, setResult] = useState<string>("");
    const [message, setMessage] = useState<string>("")

    // manage code
    const latestCodeRef = useRef(code);

    function storeCode(code: string) {
        setCode(code);
        localStorage.setItem(CODE_CONTENT_KEY, code);
        latestCodeRef.current = code;
    }

    // cursor status
    const [row, setRow] = useState<number>(getCursorRow());
    const [column, setColumn] = useState<number>(getCursorColumn());

    // mode status
    const [keyBindings, setKeyBindings] = useState<KeyBindings>(getKeyBindings())
    const [isAutoRun, setIsAutoRun] = useState<boolean>(getAutoRun())
    const [isLintOn, setIsLintOn] = useState<boolean>(getLintOn())

    const onEditorLoad = (editor: Ace.Editor) => {
        // not ready to run
        setIsRunning(true);

        if (statusBarRef.current) {
            const StatusBar = window.ace.require("ace/ext/statusbar").StatusBar;
            new StatusBar(editor, statusBarRef.current);
        }
        editor.focus();
        editor.moveCursorTo(row, column);

        // read to run
        setIsRunning(false);

        // register keydown event
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key.toLowerCase() === "enter" && event.metaKey) {
                event.preventDefault();
                debouncedRun()
                return
            }
            // shortcut for editor focus
            if (event.key.toLowerCase() === "escape") {
                editor.focus();
                return;
            }
            // shortcut for format
            if (event.key.toLowerCase() === "b" && event.metaKey) {
                event.preventDefault();
                debouncedFormat()
                return;
            }
            // shortcut for share
            if (event.key.toLowerCase() === "e" && event.metaKey) {
                event.preventDefault();
                return;
            }
        }

        window.addEventListener('keydown', handleKeyDown);
    };

    function onChange(code: string = "") {
        storeCode(code);

        if (isAutoRun && !isFormatting) {
            debouncedAutoRun();
        }
    }

    // managed debounced format
    const formatCallback = useCallback(async () => {
        try {
            setIsRunning(true)
            setIsFormatting(true)

            const {stdout, error, message} = await formatCode(latestCodeRef.current);

            if (stdout) {
                storeCode(stdout)
            }
            if (error) {
                setResult(error)
                setErrorRows(generateMarkers(error))
            }
            if (message) {
                setMessage(message)
            }

            setIsRunning(false)
            setIsFormatting(false)
        } catch (e) {
            setToastMessage((e as Error).message)
            setIsRunning(false)
            setIsFormatting(false)
        }
    }, []);
    const debouncedFormat = useRef(debounce(formatCallback, RUN_DEBOUNCE_TIME)).current;

    // manage debounced run
    const runCallback = useCallback(async () => {
        try {
            setMessage("")
            setIsRunning(true)
            setIsFormatting(true)

            const {
                stdout: formatted,
                error: formatError,
                message: formatMessage
            } = await formatCode(latestCodeRef.current);
            // format failed
            if (formatError) {
                setMessage(formatMessage)
                setResult(formatError)
                setErrorRows(generateMarkers(formatError))
                setIsRunning(false)
                setIsFormatting(false)
                return
            }

            // 2) 调用流式 SSE
            //    for await ... of 会逐条接收后端的事件
            setResult("");            // 清空之前的输出
            setErrorRows([]);         // 清空错误标记
            storeCode(formatted)      // 更新代码

            const markers = []
            for await (const evt of executeCodeStream(latestCodeRef.current)) {
                switch (evt.event) {
                    case "stdout":
                        // 追加到 result
                        setResult(prev => prev + evt.data + "\n");
                        break;

                    case "stderr":
                        // 也可以把 stderr 显示到同一个 result 或单独存储
                        setResult(prev => prev + `${evt.data}\n`);
                        markers.push(...generateMarkers(evt.data))
                        break;

                    case "timeout":
                        setMessage("Execution timed out.");
                        break;

                    case "error":
                        setMessage(evt.data)
                        break;

                    case "done":
                        break;

                    default:
                        // 处理其他自定义事件或 "message"
                        setResult(prev => prev + `[${evt.event}] ${evt.data}\n`);
                        break;
                }
            }

            setErrorRows(markers)
            setIsRunning(false)
            setIsFormatting(false)
        } catch (e) {
            const err = e as Error
            setErrorRows(generateMarkers(err.message))
            setResult(err.message)
            setIsRunning(false)
            setIsFormatting(false)
        }
    }, []);
    const debouncedRun = useRef(debounce(runCallback, RUN_DEBOUNCE_TIME)).current;
    const debouncedAutoRun = useRef(debounce(runCallback, AUTO_RUN_DEBOUNCE_TIME)).current;

    // manage debounced cursor position update
    const debouncedOnCursorChange = debounce(onCursorChange, CURSOR_UPDATE_DEBOUNCE_TIME);

    function onCursorChange(value: any) {
        const row = value.cursor.row;
        const col = value.cursor.column;

        if (statusBarRef.current) {
            statusBarRef.current.textContent = `${row + 1}:${col + 1}`;
        }

        localStorage.setItem(CURSOR_ROW_KEY, row);
        localStorage.setItem(CURSOR_COLUMN_KEY, col);

        setRow(row);
        setColumn(col);
    }

    function onLint() {
        localStorage.setItem(LINT_ON_KEY, JSON.stringify(!isLintOn));
        setIsLintOn(!isLintOn);
    }

    function onKeyBindingsChange(event: ChangeEvent<HTMLSelectElement>) {
        event.stopPropagation();
        const value = event.target.value as KeyBindings
        localStorage.setItem(KEY_BINDINGS_KEY, value);
        setKeyBindings(value)
    }

    function onAutoRun() {
        localStorage.setItem(AUTO_RUN_KEY, JSON.stringify(!isAutoRun));
        setIsAutoRun(!isAutoRun);
    }

    function onDarkThemeToggle() {
        toggleMode();
    }

    function onResizeStop(_event: MouseEvent | TouchEvent, _dir: ResizeDirection, refToElement: HTMLElement, _deltas: NumberSize) {
        const size = (refToElement.clientWidth / window.innerWidth) * 100
        localStorage.setItem(EDITOR_SIZE_KEY, JSON.stringify(size))
        setEditorSize(size)
    }

    function onFontL() {
        if (fontSize !== FONT_SIZE_L) {
            setFontSize(FONT_SIZE_L)
            localStorage.setItem(FONT_SIZE_KEY, JSON.stringify(FONT_SIZE_L))
        }
    }

    function onFontM() {
        if (fontSize !== FONT_SIZE_M) {
            setFontSize(FONT_SIZE_M)
            localStorage.setItem(FONT_SIZE_KEY, JSON.stringify(FONT_SIZE_M))
        }
    }

    function onFontS() {
        if (fontSize !== FONT_SIZE_S) {
            setFontSize(FONT_SIZE_S)
            localStorage.setItem(FONT_SIZE_KEY, JSON.stringify(FONT_SIZE_S))
        }
    }

    return (
        <div className="relative h-screen flex flex-col dark:bg-gray-800 bg-stone-100">
            <MyToast show={!!toastMessage} setShowToast={setToastMessage}>{toastMessage}</MyToast>

            <About show={showAbout} setShow={setShowAbout}/>

            <div className="flex justify-between items-center py-2 px-3  dark:text-white">
                <Link to={"/"}>
                    <h1 className="text-2xl font-bold">
                        Golang Sandbox
                    </h1>
                </Link>

                <div className="flex gap-2 justify-end items-center">
                    <Tooltip content={"cmd/win + enter"}>
                        <Button onClick={debouncedRun} disabled={isAutoRun || isRunning} className={"shadow"}
                                size={"xs"}
                                gradientDuoTone={"purpleToBlue"}>
                            Run
                        </Button>
                    </Tooltip>

                    <Tooltip content={"cmd/win + b"}>
                        <Button onClick={debouncedFormat} disabled={isAutoRun || isRunning} className={"shadow"} size={"xs"}
                                gradientMonochrome={"info"}>
                            Format
                        </Button>
                    </Tooltip>

                    <Tooltip content={"cmd/win + e"}>
                        <Button className={"shadow"} size={"xs"} gradientDuoTone={"greenToBlue"}>Share</Button>
                    </Tooltip>

                    <Divider/>

                    <Settings
                        fontSize={fontSize}
                        onFontL={onFontL}
                        onFontM={onFontM}
                        onFontS={onFontS}
                        themeMode={mode}
                        onKeyBindingsChange={onKeyBindingsChange}
                        keyBindings={keyBindings}
                        isLintOn={isLintOn}
                        onLint={onLint}
                        isAutoRun={isAutoRun}
                        onAutoRun={onAutoRun}
                    />

                    <Tooltip content={"Language"}>
                        <LanguageIcon
                            className={"text-neutral-600 dark:text-neutral-400 text-lg cursor-pointer hover:opacity-50"}/>
                    </Tooltip>

                    <Tooltip content={"Dark mode"}>
                        <DarkThemeToggle onClick={onDarkThemeToggle}/>
                    </Tooltip>

                    <p className={"text-sm text-neutral-600 cursor-pointer hover:opacity-50"}
                       onClick={() => setShowAbout(true)}>About</p>
                </div>
            </div>

            <div className={"px-3 pb-3 gap-0.5 flex flex-1"}>
                <Resizable
                    minWidth={"20%"}
                    maxWidth={"80%"}
                    enable={{
                        right: true
                    }}
                    defaultSize={{
                        width: `${editorSize}%`,
                        height: "100%"
                    }}
                    grid={[10, 1]}
                    onResizeStop={onResizeStop}
                >
                    <Wrapper className={"relative h-full flex flex-col"}>
                        <ClickBoard content={code}/>

                        <AceEditor
                            className={"flex-1"}
                            mode="golang"
                            width={"100%"}
                            theme={mode === "dark" ? "one_dark" : "dawn"}
                            defaultValue={code}
                            value={code}
                            onCursorChange={debouncedOnCursorChange}
                            fontSize={fontSize}
                            name="UNIQUE_ID_OF_DIV"
                            keyboardHandler={keyBindings}
                            editorProps={{$blockScrolling: true}}
                            setOptions={{
                                enableBasicAutocompletion: true,
                                enableLiveAutocompletion: isLintOn,
                                enableSnippets: true,
                            }}
                            onChange={onChange}
                            onLoad={onEditorLoad}
                            markers={errorRows}
                        />

                        <div ref={statusBarRef}
                             className={"px-3 border-t border-t-stone-400 dark:border-t-stone-500 text-gray-800 bg-stone-200 dark:text-white dark:bg-stone-700"}/>
                    </Wrapper>
                </Resizable>

                <Wrapper className={`relative flex flex-col py-2 px-2 bg-stone-200 text-${mapFontSize(fontSize)}`}>
                    <ClickBoard content={result}/>
                    {
                        message &&
                        <div className={"text-orange-600 border-b border-neutral-300 pb-1 mb-1"}> {message} </div>
                    }
                    <div className={"h-full overflow-auto"}>
                        <pre>{result}</pre>
                    </div>
                </Wrapper>
            </div>
        </div>
    );
}
