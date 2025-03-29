import {Tooltip} from "flowbite-react";
import {FiPlay as RunICon} from "react-icons/fi";
import {HiMiniCodeBracket as FormatIcon} from "react-icons/hi2";
import {RiShareBoxLine as ShareIcon} from "react-icons/ri";
import {MdKeyboardCommandKey, MdKeyboardControlKey, MdKeyboardReturn, MdKeyboardOptionKey} from "react-icons/md";


import {ICON_BUTTON_CLASS, TRANSLATE} from "../constants.ts";
import {languages} from "../types";
import {isMac} from "../utils.ts";

const COLOR_INACTIVE = "text-gray-300 dark:text-gray-600";
const COMMON_CLASSES = "text-xs font-light";

export default function Component(props: {
    isMobile: boolean;
    debouncedRun: () => void;
    debouncedFormat: () => void;
    debouncedShare: () => void;
    hasCode: boolean;
    isRunning: boolean;
    lan: languages;
}) {
    const {isMobile, debouncedRun, debouncedFormat, debouncedShare, hasCode, isRunning, lan} = props;
    const metaKey = isMac() ? <MdKeyboardCommandKey/> : <MdKeyboardControlKey/>;
    const isEnabled = hasCode && !isRunning;

    return (
        <>
            <Tooltip className={COMMON_CLASSES} content={
                <div className={"flex items-center gap-1"}>
                    {TRANSLATE.run[lan]}
                    <div className={"flex items-center"}>
                        {metaKey} <MdKeyboardReturn/>
                    </div>
                </div>
            }>
                <RunICon className={isEnabled ? ICON_BUTTON_CLASS : COLOR_INACTIVE}
                         onClick={isEnabled ? debouncedRun : undefined} size={isMobile ? 21 : 23}/>
            </Tooltip>

            <Tooltip className={COMMON_CLASSES} content={
                <div className={"flex items-center gap-1"}>
                    {TRANSLATE.format[lan]}
                    <div className={"flex items-center"}>
                        {metaKey} <MdKeyboardOptionKey/> L
                    </div>
                </div>
            }>
                <FormatIcon className={`mx-1.5 max-md:mx-0.5 ${isEnabled ? ICON_BUTTON_CLASS : COLOR_INACTIVE}`}
                            onClick={isEnabled ? debouncedFormat : undefined} size={isMobile ? 21 : 23}/>
            </Tooltip>

            <Tooltip className={COMMON_CLASSES} content={
                <div className={"flex items-center gap-1"}>
                    {TRANSLATE.share[lan]}
                    <div className={"flex items-center"}>
                        {metaKey} <MdKeyboardOptionKey/> E
                    </div>
                </div>
            }>
                <ShareIcon className={isEnabled ? ICON_BUTTON_CLASS : COLOR_INACTIVE}
                           onClick={isEnabled ? debouncedShare : undefined} size={isMobile ? 20 : 22}/>
            </Tooltip>
        </>
    );
}
