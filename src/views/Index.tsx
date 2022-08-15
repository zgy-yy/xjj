import React, {useEffect, useState} from 'react'
import {getData} from '../http/api'
import classes from "./index.module.scss";


let startY = 0;
let offsetY = 0

const Index: React.FC = () => {

    const [urls, setUrls] = useState<string[]>([])

    useEffect(() => {

        for (let i = 0; i < 3; i++) {
            getData().then(res => {
                const url = window.URL.createObjectURL(res.data)
                urls.push(url)
                setUrls([...urls])
            })
        }
    }, [])

    function update() {
        
    }

    return (
        <div className={classes.box}>
            {
                urls.map(item => {
                    return (<div className={classes.item} key={item}
                                 onTouchStart={(event) => {
                                     startY = event.targetTouches[0].clientY
                                 }}
                                 onTouchMove={(event) => {
                                     offsetY = event.targetTouches[0].clientY - startY
                                     const div: HTMLElement = event.target as HTMLElement
                                     const box: HTMLDivElement = div.parentElement?.parentElement as HTMLDivElement
                                     for (const item of box.children) {
                                         let a: HTMLDivElement = item as HTMLDivElement
                                         a.style.transition = 'transform 0s ease-in'
                                         a.style.transform = `translateY(${offsetY}px)`
                                     }
                                 }}
                                 onTouchEnd={(event) => {
                                     startY = 0

                                     const div: HTMLElement = event.target as HTMLElement
                                     const box: HTMLDivElement = div.parentElement?.parentElement as HTMLDivElement
                                     for (const item of box.children) {
                                         let a: HTMLDivElement = item as HTMLDivElement
                                         a.style.transition = 'transform 1s ease-in'
                                         a.style.transform = `translateY(${0}px)`
                                     }

                                     if (offsetY < -100) {
                                         urls.shift()
                                         setUrls([...urls])
                                     } else {

                                     }
                                 }}
                    >
                        <video id='vid' src={item} controls></video>
                    </div>)
                })
            }
        </div>
    )
}

export default Index