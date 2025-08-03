import { nextTick } from 'vue'

export const drag = {
    dragData: {
        //文件实例
        el: null,
        //文件放大倍数
        scale: 1,
        //文件是否正在加载
        loading: false,
        //鼠标是否按下
        isDown: false,
        //鼠标按下的位置
        downPageX: 0,
        downPageY: 0,
        //文件位移
        left: 0,
        top: 0,
        //文件初始位置
        initLeft: 0,
        initRight: 0,
        clearHandle: () => {
            drag.dragData.el = null
            drag.dragData.scale = 1
            drag.dragData.loading = false
            drag.dragData.isDown = false
            drag.dragData.downPageX = 0
            drag.dragData.downPageY = 0
            drag.dragData.left = 0
            drag.dragData.top = 0
            drag.dragData.initLeft = 0
            drag.dragData.initRight = 0
        },
        setConfig: (el, bind) => {
            const { loading, scale, mouseType, move, down, up, wheel } = bind?.value ?? {}
            drag.dragData.loading = loading
            drag.dragData.scale = scale ?? 1
            drag.dragData.el = el
            drag.dragData.mouseType = mouseType
            drag.dragData.move = move
            drag.dragData.down = down
            drag.dragData.up = up
            drag.dragData.wheel = wheel
        },
        //设置文件属性
        setStyle: () => {
            const { el, left, top, scale, isDown, mouseType, loading } = drag.dragData
            let cursor = 'default'
            if (!loading) {
                let type = mouseType?.()
                if (type) {
                    cursor = type
                } else {
                    cursor = isDown ? 'grabbing' : 'grab'
                }
            }
            el.style.transform = `scale(${scale}) translate(${left}px, ${top}px) translateZ(0)`
            el.style.cursor = cursor
        },
        //鼠标按下事件
        mouseDownHandle: (e) => {
            e.preventDefault()
            const { loading, setStyle, down } = drag.dragData
            if (loading) {
                return
            }
            drag.dragData.isDown = true
            drag.dragData.downPageX = e.pageX
            drag.dragData.downPageY = e.pageY
            down?.(e)
            setStyle()
        },
        //鼠标抬起事件
        mouseUpHandle: (e) => {
            const { loading, left, top, setStyle, up, isDown } = drag.dragData
            if (loading) {
                return
            }
            drag.dragData.isDown = false
            drag.dragData.initLeft = left
            drag.dragData.initRight = top
            up?.(e, isDown)
            setStyle()
        },
        //鼠标移动
        mouseMove: (e) => {
            const {
                initLeft,
                downPageX,
                initRight,
                downPageY,
                setStyle,
                move,
                scale,
                loading,
                isDown
            } = drag.dragData
            if (loading) {
                return
            }
            const data = move?.(e, isDown)
            if (isDown) {
                if (!data && data != undefined) {
                    return
                }

                drag.dragData.left = initLeft + (e.pageX - downPageX) / scale
                drag.dragData.top = initRight + (e.pageY - downPageY) / scale
                setStyle()
            }
        },
        //滚轮事件
        wheelHandle: (e) => {
            drag.dragData?.wheel?.(e)
        }
    },
    updated: async (el, bind) => {
        const { setConfig, setStyle } = drag.dragData

        setConfig(el, bind)
        nextTick(() => {
            setStyle()
        })
    },
    mounted: (el, bind) => {
        const { setConfig, mouseDownHandle, mouseUpHandle, mouseMove, wheelHandle } = drag.dragData
        setConfig(el, bind)
        el.addEventListener('mousedown', mouseDownHandle)
        el.addEventListener('mouseup', mouseUpHandle)
        el.addEventListener('mousemove', mouseMove)
        el.addEventListener('mouseleave', mouseUpHandle)
        el.addEventListener('wheel', wheelHandle)
    },
    unmounted: (el) => {
        const { clearHandle, mouseDownHandle, mouseUpHandle, mouseMove, wheelHandle } =
            drag.dragData

        el.removeEventListener('mousedown', mouseDownHandle)
        el.removeEventListener('mouseup', mouseUpHandle)
        el.removeEventListener('mousemove', mouseMove)
        el.removeEventListener('mouseleave', mouseUpHandle)
        el.removeEventListener('wheel', wheelHandle)
        clearHandle()
    }
}
