import '/public/common.css'

import Header from './components/header/Header';
import Greeter from './components/greeter/Greeter';
import Footer from './components/footer/Footer';
import MainContent from './components/mainContent/MainContent';
import { useState, useEffect } from 'react';

function addScrollAppearEvent(timerObj) {

    // Scroll invitation fades in 5 seconds after page has loaded if user hasn't scrolled yet
    timerObj.scrollInvAppearTimeout = setTimeout(() => {
        timerObj.invitFadeInEffect = setInterval(
            () => {
                const SCROLL_INVIT = document.getElementById('scroll-inv');

                let opacity = Number(SCROLL_INVIT.style.opacity);
                if (opacity < 1) {
                    opacity += 0.1;
                    SCROLL_INVIT.style.opacity = String(opacity);
                } else {
                    clearInterval(timerObj.invitFadeInEffect);
                }
            }, 50
        );
    }, 5000);
}

function addScrollDisappearEvent(timerObj) {

    // If user scrolls, clear timeout and hide scroll invitation if necessary
    window.addEventListener('scroll', (event) => {
        if (event.timeStamp > 500) {
            clearTimeout(timerObj.scrollInvAppearTimeout);

            const SCROLL_INVIT = document.getElementById('scroll-inv');

            if (Number(SCROLL_INVIT.style.opacity) > 0) {
                timerObj.invitFadeOutEffect = setInterval(
                    () => {
                        let opacity = Number(SCROLL_INVIT.style.opacity);
                        if (opacity > 0) {
                            opacity -= 0.1;
                            SCROLL_INVIT.style.opacity = String(opacity);
                        } else {
                            clearInterval(timerObj.invitFadeOutEffect);
                        }
                    }, 50
                );
            }
        }
    });
}

export default function Page() {
    // Timed events (aka Intervals and Timeouts)
    let AllTimers = {};


    addScrollAppearEvent(AllTimers);
    addScrollDisappearEvent(AllTimers);

    const FLOATING_ELEMENTS = document.querySelectorAll('.floating');
    for (let i = 0; i < FLOATING_ELEMENTS.length; i++) {
        FLOATING_ELEMENTS[i].style.animation = `MoveUpDown 3s ${i/2}s ease infinite`;
    }
    

    // Techs' and Projects' data at page's root
    const [myTechs, setMyTechs] = useState([]);
        
    async function FetchMyTechs() {
        try {
            let techsObj;

            const techsResp = await fetch('/data/techs.json',
                {
                    headers : { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                }
            );

            await techsResp.json().then(techs => {techsObj = Object.entries(techs)});
            setMyTechs(techsObj);
        } catch (error) {
            console.warn(error, "error");
        }
    };

    useEffect(() => {
        FetchMyTechs();
    }, []);

    // Circular cursor moving with mouse
    window.onmousemove = (e) => {
        const CIRCULAR_CURSOR = document.getElementById("circular-cursor");
        let circleSize = Number(CIRCULAR_CURSOR.style.width.slice(0, -2));

        CIRCULAR_CURSOR.style.opacity = '1';
        CIRCULAR_CURSOR.style.left = String(e.clientX+window.scrollX - (circleSize / 2)) + 'px';
        CIRCULAR_CURSOR.style.top = String(e.clientY+window.scrollY - (circleSize / 2)) + 'px';

        if (AllTimers.cursorDisappearTimeout) {
            clearTimeout(AllTimers.cursorDisappearTimeout);
        }

        AllTimers.cursorDisappearTimeout = setTimeout(() => {
            AllTimers.cursorFadeOutEffect = setInterval(
                () => {
                    if (CIRCULAR_CURSOR.style.opacity > 0) {
                        CIRCULAR_CURSOR.style.opacity -= 0.1;
                    } else {
                        clearInterval(AllTimers.cursorFadeOutEffect);
                    }
                }, 25
            );
        }, 500);
    }

    // Whole page's content is returned to main.jsx
    return (
    <>
        <div id="circular-cursor" style={{width: "50px", height: "50px"}}></div>
        
        <Header/>
        <Greeter timers={AllTimers} />
        <MainContent timers={AllTimers} techs={myTechs} />
        <Footer timers={AllTimers} />
    </>
    );
}