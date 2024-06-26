import { useState, useEffect, useRef } from "react";
import React from "react";
import {BsChevronLeft, BsChevronRight} from 'react-icons/bs';
import {AiOutlineLine} from 'react-icons/ai';

export const CarouselItem = ({children, width}) => {
  return (
    <div className="inline-flex items-center justify-center" style={{ width: width }}>
      {children}
    </div>
  );
}

const Carousel = ({className="", children, speed=700, autoplayDuration=-1, indicators=true}) => {
  const styles = {
    carousel: `overflow-hidden relative`,
    inner: `whitespace-nowrap`,
    control: `opacity-30 hover:opacity-100 cursor-pointer`,
    indicators: `absolute bottom-0 left-1/2 -translate-x-1/2`,
    indicator: `opacity-30 hover:opacity-100 cursor-pointer`,
    icons: `text-black text-4xl`
  }

  const [activeIndex, setActiveIndex] = useState(0);
  const [trans, setTrans] = useState("");

  const [enabledL, setEnabledL] = useState(true);
  const [enabledR, setEnabledR] = useState(true);

  const updateIndex = (newIndex, d) => {
    clearTimeout(timeout.current);
    if (React.Children.count(children) > 1) {
      if (newIndex < 0) {
        setTrans("none");
        newIndex = React.Children.count(children);

        setTimeout(() => {
          setTrans("");
          setActiveIndex(React.Children.count(children)-1);
        }, 10)
      } else if (newIndex >= React.Children.count(children)) {
        setTimeout(() => {
          setTrans("none");
          setActiveIndex(0);
          
          setTimeout(() => {
            setTrans("");
          }, 20)
        }, speed)
      }

      setActiveIndex(newIndex);
      if (d == "L") {
        setEnabledL(false);
        setTimeout(() => {
          setEnabledL(true);
        }, speed + 20)
      } else if (d == "R") {
        setEnabledR(false);
        setTimeout(() => {
          setEnabledR(true);
        }, speed + 20)
      }
    }
  }

  const autoplay = useRef(null);
  const timeout = useRef(null);

  if (autoplayDuration != -1 && React.Children.count(children) > 1) {
    useEffect(() => {
      autoplay.current = setInterval(() => {
        updateIndex(activeIndex + 1, 'R');
      }, autoplayDuration);

      return () => {
        clearInterval(autoplay.current);
      } 
    }, [activeIndex])
  }

  return (
    <div className={`flex overflow-hidden justify-center items-center`}>
      <div
        className={`${styles.control} left-0`}
        onMouseEnter={() => { if (autoplayDuration != -1 && React.Children.count(children) > 1) { clearInterval(autoplay.current); } }}
        onMouseLeave={() => { if (autoplayDuration != -1 && React.Children.count(children) > 1) { timeout.current = setTimeout(() => { updateIndex(activeIndex + 1, 'R');}, autoplayDuration); } }}
      >
        {enabledL && <button onClick={() => { updateIndex(activeIndex - 1, 'L') }}>
          <BsChevronLeft className={`${styles.icons}`} />
        </button>}
        {!enabledL && <button disabled>
          <BsChevronLeft className={`${styles.icons}`} />
        </button>}
      </div>

      <div
        className={`${className} ${styles.carousel}`}
        onMouseEnter={() => { if (autoplayDuration != -1 && React.Children.count(children) > 1) { clearInterval(autoplay.current); } }}
        onMouseLeave={() => { if (autoplayDuration != -1 && React.Children.count(children) > 1) { timeout.current = setTimeout(() => { updateIndex(activeIndex + 1, 'R');}, autoplayDuration); } }}
      >
        <div className={`${styles.inner}`} style={{ transition: trans, transitionDuration: trans=='' ? `${speed}ms` : '', transform: `translateX(-${ activeIndex*100 }%)` }}>
          {React.Children.map(children, (child, idx) => {
            return React.cloneElement(child, { width: "100%"});
          })}
          {React.Children.count(children) > 1 && React.cloneElement(children[0], { width: "100%"})}
        </div>

        {indicators && <div name="indicators" className={`${styles.indicators}`}>
          {React.Children.map(children, (child, idx) => {
            return (
              <>
                {enabledL && enabledR && <button onClick={() => { updateIndex(idx, 'B') }} className={`${styles.indicator}`} style={{ opacity: idx==activeIndex%React.Children.count(children) ? '1' : '' }}><AiOutlineLine className={`${styles.icons}`} /></button>}
                {!(enabledL && enabledR) && <button className={`${styles.indicator}`} style={{ opacity: idx==activeIndex%React.Children.count(children) ? '1' : '' }}><AiOutlineLine className={`${styles.icons}`} /></button>}
              </>
            );
          })}
        </div>}
      </div>

      <div
        className={`${styles.control} right-0`}
        onMouseEnter={() => { if (autoplayDuration != -1 && React.Children.count(children) > 1) { clearInterval(autoplay.current); } }}
        onMouseLeave={() => { if (autoplayDuration != -1 && React.Children.count(children) > 1) { timeout.current = setTimeout(() => { updateIndex(activeIndex + 1, 'R');}, autoplayDuration); } }}
      >
        {enabledR && <button onClick={() => { updateIndex(activeIndex + 1, 'R') }}>
          <BsChevronRight className={`${styles.icons}`} />
        </button>}
        {!enabledR && <button disabled>
          <BsChevronRight className={`${styles.icons}`} />
        </button>}
      </div>
    </div>
  );
}

export default Carousel;