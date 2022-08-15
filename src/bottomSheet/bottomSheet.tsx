import React, {useEffect, useRef, useState} from "react";
import './bottomSheet.scss'
import {DragStatus, DragType} from "../utils/enums";

const BottomSheet: React.FC<{children?: React.ReactNode}> = ({children}) => {
    const [animationClassName, setAnimationClassName] = useState<string>("")
    const dragStatus = useRef<DragStatus>(DragStatus.OFF)
    const dragType = useRef<DragType>(DragType.NONE)
    const dragStartY = useRef<number>(NaN)
    const [top, setTop] = useState<number>(95);
    const topRef = useRef<number>(NaN)
    useEffect(() => {
        topRef.current = top;
    }, [top])

    /*
    * Events
    * */
    const dragStart = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        setAnimationClassName("");
        dragStatus.current = DragStatus.ON;
        dragType.current = event.type.includes('mouse') ? DragType.MOUSE : DragType.TOUCH;
        initStartEvent(event);
        event.preventDefault();
        event.stopPropagation();
    }

    const dragMove = (event: MouseEvent | TouchEvent) => {
        if (dragStatus.current === DragStatus.ON) {
            trackMoveEvent(event);
            event.preventDefault();
            event.stopPropagation();
        }
    }

    const dragEnd = () => {
        dragStatus.current = DragStatus.OFF;
        dragType.current = DragType.NONE;
        dragStartY.current = NaN;
        animate();
    }

    useEffect(() => {
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('touchend', dragEnd);
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('touchmove', dragMove);

        return () => {
            document.removeEventListener('mouseup', dragEnd);
            document.removeEventListener('touchend', dragEnd);
            document.removeEventListener('mousemove', dragMove);
            document.removeEventListener('touchmove', dragMove);
        }
    }, [])
    /*
    * End Events
    * */

    const initStartEvent = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (dragType.current === DragType.MOUSE) {
            dragStartY.current = (event as React.MouseEvent<HTMLDivElement>).pageY;
        } else {
            dragStartY.current = (event as React.TouchEvent<HTMLDivElement>).changedTouches[0].pageY;
        }
    }

    const trackMoveEvent = (event: MouseEvent | TouchEvent) => {
        const pageY = dragType.current === DragType.MOUSE ?
            (event as MouseEvent).pageY :
            (event as TouchEvent).changedTouches[0].pageY;

        const addedTop = getVH(pageY - dragStartY.current)
        dragStartY.current = pageY;
        setTop(addedTop + topRef.current);
    }

    const animate = () => {
        setAnimationClassName("true")
        setTop(topRef.current >= 50 ? 95 : 10);
    }

    const getVH = (value: number) => {
        const windowHeight = window.innerHeight;
        return (value * 100 / windowHeight);
    }

    return (
        <div
            style={{
                top: `${top}vh`
            }}
            className={`bottomSheetMainContainer ${animationClassName}`}
        >
            <div
                onMouseDown={dragStart}
                onTouchStart={dragStart}
                className={'indicator'}
            >
                <span/>
            </div>
            <div className={'contentContainer'}>
                {
                    children
                }
            </div>
        </div>
    )
}


export default BottomSheet