import {Tooltip} from "flowbite-react";
import {FiPlay as RunICon} from "react-icons/fi";
import {HiMiniCodeBracket as FormatIcon} from "react-icons/hi2";
import {RiShareBoxLine as ShareIcon} from "react-icons/ri";

import {ICON_BUTTON_CLASS, TRANSLATE} from "../constants.ts";
import {languages} from "../types";
import {isMac} from "../utils.ts";

const COLOR_INACTIVE = "text-gray-300 dark:text-gray-600";
const CMD = "Cmd"
const WIN = "win"
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
    const metaKey = isMac() ? CMD : WIN;
    const isEnabled = hasCode && !isRunning;

    return (
        <>
            <Tooltip className={COMMON_CLASSES} content={`${TRANSLATE.run[lan]}: ${metaKey} + enter`}>
                <RunICon className={isEnabled ? ICON_BUTTON_CLASS : COLOR_INACTIVE}
                         onClick={isEnabled ? debouncedRun : undefined} size={isMobile ? 21 : 23}/>
            </Tooltip>

            <Tooltip className={COMMON_CLASSES} content={`${TRANSLATE.format[lan]}: ${metaKey} + b`}>
                <FormatIcon className={`mx-1.5 max-md:mx-0.5 ${isEnabled ? ICON_BUTTON_CLASS : COLOR_INACTIVE}`}
                            onClick={isEnabled ? debouncedFormat : undefined} size={isMobile ? 21 : 23}/>
            </Tooltip>

            <Tooltip className={COMMON_CLASSES} content={`${TRANSLATE.share[lan]}: ${metaKey} + e`}>
                <ShareIcon className={isEnabled ? ICON_BUTTON_CLASS : COLOR_INACTIVE}
                           onClick={isEnabled ? debouncedShare : undefined} size={isMobile ? 20 : 22}/>
            </Tooltip>
        </>
    );
}
