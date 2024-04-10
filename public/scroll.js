//scroll.js

window.onload = function() { 
  
  // Add event listener for window resize
window.addEventListener('resize', () => {
    location.reload();
});

 

function createEmoji(event) {
  const emojis = ['🦜', '🌻', '🛹', '💅', '🍉', '💪', '💬', '🍧', '🚽', '⏩', '🤫', '📋','💀','🙃','🎉']; 
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)]; 
  
  const emojiElement = document.createElement('div');
  emojiElement.textContent = randomEmoji;
  emojiElement.style.position = 'absolute';
  emojiElement.style.zIndex = '0'; 
  
  const sizeMultiplier = 1.5 + Math.random(); 
  emojiElement.style.fontSize = `${sizeMultiplier * 25}px`;
  
  emojiElement.style.left = event.clientX + 'px'; 
  emojiElement.style.top = event.clientY + 'px'; 

  emojiElement.style.userSelect = 'none';
  emojiElement.style.webkitTouchCallout = 'none';

  document.body.appendChild(emojiElement);

  gsap.to(emojiElement, {
    x: Math.random() * 200 - 100,
    y: Math.random() * 200 - 100,
    opacity: 0,
    duration: 3,
    ease: 'power1.inOut',
    onComplete: () => {
      emojiElement.remove();
    }
  });
}

document.addEventListener('touchstart', (event) => {
  createEmoji(event.touches[0]); // Pass the first touch event
});

document.addEventListener('mousedown', (event) => {
  createEmoji(event);
});

      
  
  
  
function scrollToLastEntry() {
    const lastEntry = document.getElementById("AlgoLingo").lastElementChild;
    lastEntry.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
}


    
// Function to execute after getAlgoLingo is successfully fetched
function executeAfterGetAlgoLingo(data) {
    
    console.log(data);
    
    gsap.registerPlugin(ScrollTrigger, Draggable, EasePack);
          let resumeTimer;
        
        
            console.log("windowloaded")
        
          const wrapper = document.querySelector("ul");
          const boxes = gsap.utils.toArray("li");
          loop = verticalLoop(boxes, { repeat: -1, paused: false, draggable: true });
        
        
            function verticalLoop(items, config) {
                items = gsap.utils.toArray(items);
                config = config || {};
                let onChange = config.onChange,
                    lastIndex = 0,
                    tl = gsap.timeline({
        
                        repeat: config.repeat,
                        onUpdate: onChange && function() {
                            let i = tl.closestIndex();
                            if (lastIndex !== i) {
                                lastIndex = i;
                                onChange(items[i], i);
                            }
                        },
                        paused: config.paused,
                        defaults: { ease: "none" },
                        onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)
                    }),
                    length = items.length,
                    startY = items[0].offsetTop,
                    times = [],
                    heights = [],
                    spaceBefore = [],
                    yPercents = [],
                    curIndex = 0,
                    center = config.center,
                    clone = obj => {
                        let result = {},
                            p;
                        for (p in obj) {
                            result[p] = obj[p];
                        }
                        return result;
                    },
                    pixelsPerSecond = (config.speed || 1) * 100,
                    snap = config.snap === false ? v => v : gsap.utils.snap(config.snap || 1),
                    timeOffset = 0,
                    container = center === true ? items[0].parentNode : gsap.utils.toArray(center)[0] || items[0].parentNode,
                    totalHeight,
                    getTotalHeight = () => items[length - 1].offsetTop + yPercents[length - 1] / 100 * heights[length - 1] - startY + spaceBefore[0] + items[length - 1].offsetHeight * gsap.getProperty(items[length - 1], "scaleY") + (parseFloat(config.paddingBottom) || 0),
                    populateHeights = () => {
                        let b1 = container.getBoundingClientRect(),
                            b2;
                        startY = items[0].offsetTop;
                        items.forEach((el, i) => {
                            heights[i] = parseFloat(gsap.getProperty(el, "height", "px"));
                            yPercents[i] = snap(parseFloat(gsap.getProperty(el, "y", "px")) / heights[i] * 100 + gsap.getProperty(el, "yPercent"));
                            b2 = el.getBoundingClientRect();
                            spaceBefore[i] = b2.top - (i ? b1.bottom : b1.top);
                            b1 = b2;
                        });
                        gsap.set(items, {
                            yPercent: i => yPercents[i]
                        });
                        totalHeight = getTotalHeight();
                    },
                    timeWrap,
                    populateOffsets = () => {
                        timeOffset = center ? tl.duration() * (container.offsetWidth / 2) / totalHeight : 0;
                        center && times.forEach((t, i) => {
                            times[i] = timeWrap(tl.labels["label" + i] + tl.duration() * heights[i] / 2 / totalHeight - timeOffset);
                        });
                    },
                    getClosest = (values, value, wrap) => {
                        let i = values.length,
                            closest = 1e10,
                            index = 0,
                            d;
                        while (i--) {
                            d = Math.abs(values[i] - value);
                            if (d > wrap / 2) {
                                d = wrap - d;
                            }
                            if (d < closest) {
                                closest = d;
                                index = i;
                            }
                        }
                        return index;
                    },
                    populateTimeline = () => {
                        let i,
                            item,
                            curY,
                            distanceToStart,
                            distanceToLoop;
                        tl.clear();
                        for (i = 0; i < length; i++) {
                            item = items[i];
                            curY = yPercents[i] / 100 * heights[i];
                            distanceToStart = item.offsetTop + curY - startY + spaceBefore[0];
                            distanceToLoop = distanceToStart + heights[i] * gsap.getProperty(item, "scaleY");
                            tl.to(item, {
                                    yPercent: snap((curY - distanceToLoop) / heights[i] * 100),
                                    duration: distanceToLoop / pixelsPerSecond
                                }, 0)
                                .fromTo(item, {
                                    yPercent: snap((curY - distanceToLoop + totalHeight) / heights[i] * 100)
                                }, {
                                    yPercent: yPercents[i],
                                    duration: (curY - distanceToLoop + totalHeight - curY) / pixelsPerSecond,
                                    immediateRender: false
                                }, distanceToLoop / pixelsPerSecond)
                                .add("label" + i, distanceToStart / pixelsPerSecond);
                            times[i] = distanceToStart / pixelsPerSecond;
                        }
                        timeWrap = gsap.utils.wrap(0, tl.duration());
                    },
                    customAnimations = () => {
                        let {
                            enterAnimation,
                            leaveAnimation
                        } = config,
                            eachDuration = tl.duration() / items.length;
                        items.forEach((item, i) => {
                            let anim = enterAnimation && enterAnimation(item, eachDuration, i),
                                isAtEnd = anim && (tl.duration() - timeWrap(times[i] - Math.min(eachDuration, anim.duration())) < eachDuration - 0.05);
                            anim && tl.add(anim, isAtEnd ? 0 : timeWrap(times[i] - anim.duration()));
                            anim = leaveAnimation && leaveAnimation(item, eachDuration, i);
                            isAtEnd = times[i] === tl.duration();
                            anim && anim.duration() > eachDuration && anim.duration(eachDuration);
                            anim && tl.add(anim, isAtEnd ? 0 : times[i]);
                        });
                    },
                    refresh = (deep) => {
                        let progress = tl.progress();
                        tl.progress(0, true);
                        populateHeights();
                        deep && populateTimeline();
                        populateOffsets();
                        customAnimations();
                        deep && tl.draggable ? tl.time(times[curIndex], true) : tl.progress(progress, true);
                    },
                    proxy;
                gsap.set(items, {
                    y: 0
                });
                populateHeights();
                populateTimeline();
                populateOffsets();
                customAnimations();
                window.addEventListener("resize", () => refresh(true));
        
                function toIndex(index, vars) {
                    vars = clone(vars);
                    (Math.abs(index - curIndex) > length / 2) && (index += index > curIndex ? -length : length); // always go in the shortest direction
                    let newIndex = gsap.utils.wrap(0, length, index),
                        time = times[newIndex];
                    if (time > tl.time() !== index > curIndex) { // if we're wrapping the timeline's playhead, make the proper adjustments
                        time += tl.duration() * (index > curIndex ? 1 : -1);
                    }
                    if (vars.revolutions) {
                        time += tl.duration() * Math.round(vars.revolutions);
                        delete vars.revolutions;
                    }
                    if (time < 0 || time > tl.duration()) {
                        vars.modifiers = { time: timeWrap };
                    }
                    curIndex = newIndex;
                    vars.overwrite = true;
                    gsap.killTweensOf(proxy);
                    return tl.tweenTo(time, vars);
                }
        
                tl.elements = items;
                tl.next = vars => toIndex(curIndex + 1, vars);
                tl.previous = vars => toIndex(curIndex - 1, vars);
                tl.current = () => curIndex;
                tl.toIndex = (index, vars) => toIndex(index, vars);
                tl.closestIndex = setCurrent => {
                    let index = getClosest(times, tl.time(), tl.duration());
                    setCurrent && (curIndex = index);
                    return index;
                };
                tl.times = times;
                tl.progress(1, true).progress(0, true); // pre-render for performance
                if (config.reversed) {
                    tl.vars.onReverseComplete();
                    tl.reverse();
                }
        
        
                // dragging 
                if (config.draggable && typeof(Draggable) === "function") {
                    proxy = document.createElement("div");
                    let wrap = gsap.utils.wrap(0, 1),
                        ratio, startProgress, draggable, dragSnap,
                        align = () => tl.progress(wrap(startProgress + (draggable.startY - draggable.y) * ratio)),
                        syncIndex = () => tl.closestIndex(true);
                    draggable = Draggable.create(proxy, {
                        trigger: items[0].parentNode,
                        type: "y",
                        onPressInit() {
                            gsap.killTweensOf(tl);
                            startProgress = tl.progress();
                            refresh();
                            ratio = 1 / totalHeight;
                            gsap.set(proxy, { y: startProgress / -ratio });
                        },
                        onDrag: align,
                        onThrowUpdate: align,
                        inertia: true,
                        snap: value => {
                            let time = -(value * ratio) * tl.duration(),
                                wrappedTime = timeWrap(time),
                                snapTime = times[getClosest(times, wrappedTime, tl.duration())],
                                dif = snapTime - wrappedTime;
                            Math.abs(dif) > tl.duration() / 2 && (dif += dif < 0 ? tl.duration() : -tl.duration());
                            return (time + dif) / tl.duration() / -ratio;
                        },
                        onRelease: () => {
                            // Pause the loop animation
                            loop.pause();
        
                            // Clear the resume timer if dragging ends before 5 seconds
                            clearTimeout(resumeTimer);
        
                            // Set a timer to resume the animation after 5 seconds
                            resumeTimer = setTimeout(() => {
                                loop.play();
                            }, 5000);
        
                            syncIndex();
                        },
                        onThrowComplete: () => {
                            // Pause the loop animation
                            loop.pause();
        
                            // Set a timer to resume the animation after 5 seconds
                            resumeTimer = setTimeout(() => {
                                loop.play();
                            }, 5000);
        
                            syncIndex();
                        }
                    })[0];
                    tl.draggable = draggable;
                }
        
        
        
        
                tl.closestIndex(true);
                onChange && onChange(items[curIndex], curIndex);
                return tl;
            
        
        
        
        
        
          }
    console.log("Scroll.js executed after getAlgoLingo is fetched");
  }
  
  

// Fetch getAlgoLingo data
fetch('/getAlgoLingo')
    .then(response => response.json())
    .then(data => {
        // Call the function to execute after getAlgoLingo is fetched
        executeAfterGetAlgoLingo(data);

        // Scroll to the last entry and add sparkle emoji after data is fetched
        scrollToLastEntry();
    })
    .catch(error => {
        console.error('Error fetching AlgoLingo:', error);
    });

  
}

