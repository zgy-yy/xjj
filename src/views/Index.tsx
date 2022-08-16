import React, {useEffect, useMemo, useRef, useState} from 'react'
import {getData} from '../http/api'
import classes from "./index.module.scss";
import it from "node:test";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;
import zanting from '../../src/assets/zanting.svg'


let startY = 0;
let offsetY = 0
let curIndex = 0
type Act = 'ing' | 'end'

const buffer: string[] = []

const timeOut = 1000


const Index: React.FC = () => {

    const [urls, setUrls] = useState<string[]>([])

    const [play, setPlay] = useState(false)

    const divs = useRef<HTMLDivElement>(null)

    async function getMoreUrl(): Promise<string> {
        return getData().then(res => {
            const url: string = URL.createObjectURL(res.data)
            if (url) {
                buffer.push(url)
                return url
            } else {
                return getMoreUrl()
            }
        })
    }

    useEffect(() => {
        for (let i = 0; i < 8; i++) {
            getMoreUrl().then(res => {
                if (urls.length < 5) {
                    console.log('url', urls)
                    urls.push(res)
                    setUrls([...urls])

                    getCurPlayer(0, true)
                }
            })
        }
    }, [])

    const transitionStyle = `transform ${timeOut}ms ease-in`

    const transAction = (divList: HTMLElement[], type: Act) => {
        const len = divList.length
        const curind = curIndex % len
        if (type == 'ing') {
            for (let i = 0; i < len; i++) {
                divList[(curind + i) % len].style.transform = `translateY(calc(${offsetY}px + ${i * 100}%))`
                if (curIndex > 0) {
                    if (i == len - 1) {
                        divList[(curind + i) % len].style.transform = `translateY(calc(${offsetY}px + ${-100}%))`
                    }
                }
            }
        } else if (type == 'end') {
            for (let i = 0; i < len; i++) {
                divList[(curind + i) % len].style.transform = `translateY(${i * 100}%)`

                if (i == 0 || i == 1) { //将播放的和播放的下一
                    divList[(curind + i) % len].style.transition = transitionStyle
                    divList[(curind + i) % len].style.zIndex = '1'
                }
                if (curIndex > 0) {
                    if (i == len - 1) { //已播放 要隐藏的
                        divList[(curind + i) % len].style.transition = transitionStyle
                        divList[(curind + i) % len].style.transform = `translateY(${-100}%)`
                    }
                }
            }
        }
    }


    function updating(offY: number) {
        offsetY = offY
        if (divs.current) {
            const divList: HTMLElement[] = Array.from(divs.current.children) as HTMLDivElement[]
            transAction(divList, 'ing')
        }

    }

    function updated() {
        if (divs.current) {
            const divList: HTMLElement[] = Array.from(divs.current.children) as HTMLDivElement[]
            if (offsetY < -100) {
                curIndex++
                changeUp(curIndex % divList.length)
            }
            if (offsetY > 100) {
                curIndex--
                if (curIndex < 0) {
                    console.log('error')
                    curIndex = 0
                }
                changeDown(curIndex % divList.length)
            }
            transAction(divList, 'end')

        }
    }

    function getCurPlayer(inc: number, play: boolean) {
        if (divs.current) {
            const divList: HTMLElement[] = Array.from(divs.current.children) as HTMLDivElement[]
            divList.map((item, index) => {
                const vdo = item.firstElementChild as HTMLVideoElement
                vdo.pause()
                //当前player
                if (inc == index) {
                    vdo.muted = false
                    if (play) {
                        vdo.play().then(() => {
                            setPlay(true)
                        })
                    } else {
                        vdo.pause()
                        vdo.onpause = () => {
                            setPlay(false)
                        }
                    }
                }
            })
        }
    }

    function changeUp(inc: number) {

        getCurPlayer(inc, true)


        getMoreUrl()
        if (curIndex < buffer.length) {
            const lastInc = (inc - 2 + urls.length) % urls.length
            urls[lastInc] = buffer[3 + curIndex]
            setTimeout(() => { //等待动画过度完成
                setUrls([...urls])
            }, timeOut)
        }
    }

    function changeDown(inc: number) {
        getCurPlayer(inc, true)
        const lastInc = (inc - 1 + urls.length) % urls.length
        console.log(lastInc, curIndex)
        urls[lastInc] = buffer[curIndex - 1]
        setUrls([...urls])
    }

    return (
        <>
            <div className={classes.box} ref={divs}

            >
                {
                    urls.map((item, index) => {
                        return <div key={index} className={classes.item}>
                            <video id='vid' src={item} muted></video>
                        </div>
                    })
                }
            </div>
            <div className={classes.mask}
                 onTouchStart={(event) => {
                     startY = event.targetTouches[0].clientY
                     offsetY=0

                     if (divs.current) {
                         const divList: HTMLElement[] = Array.from(divs.current.children) as HTMLDivElement[]
                         divList.map(item => {
                             item.style.zIndex = '0'
                             item.style.transition = 'transform 0s ease-out'
                         })

                     }
                 }}
                 onTouchMove={(event) => {
                     offsetY = event.targetTouches[0].clientY - startY
                     updating(offsetY)
                 }}
                 onTouchEnd={(event) => {
                     startY = 0
                     updated()
                 }}
                 onClick={() => {
                     getCurPlayer(curIndex % urls.length, !play)
                 }}>{
                play?'': <img src={zanting} alt="暂停" />
            }
            </div>
        </>
    )
}

export default Index