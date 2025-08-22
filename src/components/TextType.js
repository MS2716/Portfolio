"use client";

import { useEffect, useRef, useState, createElement, useCallback } from "react";
import { gsap } from "gsap";

const TextType = ({
  text,
  as: Component = "div",
  typingSpeed = 1,
  initialDelay = 0,
  pauseDuration = 0,
  deletingSpeed = 30,
  loop = true,
  className = "",
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = "|",
  cursorClassName = "",
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  isHtml = true,
  ...props
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const [isTypingComplete, setIsTypingComplete] = useState(true); 
  const cursorRef = useRef(null);
  const containerRef = useRef(null);

  const textArray = Array.isArray(text) ? text : [text];

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    const { min, max } = variableSpeed;
    return Math.random() * (max - min) + min;
  }, [variableSpeed, typingSpeed]);

  const getCurrentTextColor = () => {
    if (textColors.length === 0) return "#ffffff";
    return textColors[currentTextIndex % textColors.length];
  };

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (showCursor && cursorRef.current) {
      gsap.set(cursorRef.current, { opacity: 1 });
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: cursorBlinkDuration,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      });
    }
  }, [showCursor, cursorBlinkDuration]);

  // Function to extract text content from HTML while preserving structure for typing
  const parseHtmlForTyping = (htmlString) => {
    if (!isHtml) return htmlString;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;

    const textNodes = [];
    const walker = document.createTreeWalker(
      tempDiv,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    let node;
    while (node = walker.nextNode()) {
      if (node.textContent.trim()) {
        textNodes.push(node.textContent);
      }
    }

    return textNodes.join('');
  };

  useEffect(() => {
    if (!isVisible) return;

    let timeout;

    const currentText = textArray[currentTextIndex];

    // For HTML content, extract only visible text for typing calculation
    const textForTyping = isHtml ? parseHtmlForTyping(currentText) : currentText;
    const processedText = reverseMode
      ? textForTyping.split("").reverse().join("")
      : textForTyping;

    const executeTypingAnimation = () => {
      if (isDeleting) {
        if (displayedText === "") {
          setIsDeleting(false);
          setIsTypingComplete(false);
          if (currentTextIndex === textArray.length - 1 && !loop) {
            return;
          }

          if (onSentenceComplete) {
            onSentenceComplete(textArray[currentTextIndex], currentTextIndex);
          }

          setCurrentTextIndex((prev) => (prev + 1) % textArray.length);
          setCurrentCharIndex(0);
          timeout = setTimeout(() => {}, pauseDuration);
        } else {
          timeout = setTimeout(() => {
            setDisplayedText((prev) => prev.slice(0, -1));
          }, deletingSpeed);
        }
      } else {
        if (currentCharIndex < processedText.length) {
          timeout = setTimeout(
            () => {
              if (isHtml) {
                // For HTML content, gradually reveal characters while maintaining HTML structure
                const targetLength = currentCharIndex + 1;
                let charCount = 0;
                let htmlResult = '';

                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = currentText;

                // Create a more accurate HTML typing effect
                const createTypedHtml = (html, targetLength) => {
                  const tempContainer = document.createElement('div');
                  tempContainer.innerHTML = html;
                  
                  let charCount = 0;
                  let result = '';
                  
                  const processNode = (node) => {
                    if (charCount >= targetLength) return '';
                    
                    if (node.nodeType === Node.TEXT_NODE) {
                      const text = node.textContent;
                      const remainingChars = targetLength - charCount;
                      const visibleText = text.substring(0, remainingChars);
                      charCount += visibleText.length;
                      return visibleText;
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                      let elementHtml = `<${node.tagName.toLowerCase()}`;
                      
                      // Add attributes
                      for (let attr of node.attributes) {
                        elementHtml += ` ${attr.name}="${attr.value}"`;
                      }
                      elementHtml += '>';
                      
                      // Process children
                      let childContent = '';
                      for (let child of node.childNodes) {
                        if (charCount >= targetLength) break;
                        childContent += processNode(child);
                      }
                      
                      elementHtml += childContent;
                      elementHtml += `</${node.tagName.toLowerCase()}>`;
                      
                      return elementHtml;
                    }
                    
                    return '';
                  };
                  
                  for (let child of tempContainer.childNodes) {
                    if (charCount >= targetLength) break;
                    result += processNode(child);
                  }
                  
                  return result;
                };

                const typedHtml = createTypedHtml(currentText, targetLength);
                setDisplayedText(typedHtml);
              } else {
                setDisplayedText(
                  (prev) => prev + processedText[currentCharIndex]
                );
              }
              setCurrentCharIndex((prev) => prev + 1);
            },
            variableSpeed ? getRandomSpeed() : typingSpeed
          );
        } else {
          setIsTypingComplete(true); // Mark typing as complete
          if (textArray.length > 1) {
            timeout = setTimeout(() => {
              setIsDeleting(true);
            }, pauseDuration);
          }
        }
      }
    };

    if (currentCharIndex === 0 && !isDeleting && displayedText === "") {
      timeout = setTimeout(executeTypingAnimation, initialDelay);
    } else {
      executeTypingAnimation();
    }

    return () => clearTimeout(timeout);
  }, [
    currentCharIndex,
    displayedText,
    isDeleting,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    textArray,
    currentTextIndex,
    loop,
    initialDelay,
    isVisible,
    reverseMode,
    variableSpeed,
    onSentenceComplete,
    getRandomSpeed,
    isHtml,
  ]);

  const shouldHideCursor =
    hideCursorWhileTyping &&
    (currentCharIndex < textArray[currentTextIndex].length || isDeleting);

  return createElement(
    Component,
    {
      ref: containerRef,
      className: `inline-block tracking-tight ${className}`,
      style: { lineHeight: 'normal' },
      ...props,
    },
    <span className="inline" style={{ color: getCurrentTextColor(), lineHeight: 'inherit' }}>
      {isHtml ? (
        <span 
          dangerouslySetInnerHTML={{ __html: displayedText }}
          style={{ lineHeight: 'inherit' }}
        />
      ) : (
        displayedText
      )}
    </span>,
    showCursor && (
      <span
        ref={cursorRef}
        className={`ml-1 inline-block opacity-100 ${shouldHideCursor ? "hidden" : ""} ${cursorClassName}`}
      >
        {cursorCharacter}
      </span>
    )
  );
};

export default TextType;