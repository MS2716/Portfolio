import React, { useState, useEffect, useRef } from "react";
import TextType from "./TextType";

const Terminal = () => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState([]);
  const [completedOutputs, setCompletedOutputs] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  // Command content
  const commands = {
    help: `
      Available commands: <br />
      about - Learn about me<br />
      projects - View my projects<br />
      skills - See my technical skills<br />
      experience - My work experience<br />
      contact - How to reach me<br />
      education - My educational background<br />
      certifications - View my certifications<br />
      clear - Clear the terminal<br />
      <br />
      Type any command to continue...
    `,
    about: `
      <p>👋 Hi, I'm Maitri Suthar! </p>
      <p>
        I'm a Software Developer skilled in web and mobile app development
        using HTML, CSS, JavaScript, Python, and React experienced in creating
        responsive, user-centric solutions.Visually appealing, responsive web pages for online
        courses using HTML, CSS, and JavaScript.
      </p><br />
      <p>
        Background: <br />
        - Previously worked as the web development intern at Edunock.<br />
        - Focus on building visually appealing, responsive web pages for
        online courses using HTML, CSS, and JavaScript.<br />
        - Skilled in JavaScript, React and Python.<br />
      </p><br />

      <p>Feel free to explore more using the 'projects', 'skills', or 'contact' commands!</p>
    `,
    projects: `
      Projects:<br />
      1. <a href="https://portfolio-xyvu.onrender.com" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline">Developer Portfolio Website</a> - A terminal-style portfolio (this one!)<br />
      1. <a href="https://whatsapp-frontend-6ll5.onrender.com/" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline">WhatsApp Clone</a> - A simple chat application using React<br />
      3. <a href="https://ms2716.github.io/Whack-a-Mole/" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline">Whack-a-Mole</a> - Whack-a-Mole Game to play in brower<br />
      2. <a href="https://ms2716.github.io/MaitriSuthar/" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline">Portfolio Website</a> - A Static website using the HTML, CSS and JS<br />
      3. <a href="https://ms2716.github.io/NotesApp/" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline">Notes App</a> - Note Taking site basic note create and delete<br />

    `,
    skills: `Skills:<br />
      - Programming Languages: HTML, CSS, JavaScript, Python, React<br />
      - Tools & Frameworks: WordPress, SQL, MongoDB, CorelDRAW <br />
      - Web Development: Responsive Design, Troubleshooting, User-Centric Interfaces`,
    experience: `💼 Work Experience:<br />
      <b>Web Development Intern at Edunock (Aug 2023 - Feb 2024)<br /></b>
      - Developed and maintained visually appealing, responsive web pages for online courses using HTML, CSS, and JavaScript.<br/>
      - Integrated updates to improve functionality and user engagement on the website.  Troubleshooting and resolving website issues to ensure optimal performance and user experience.<br />
      - Enhanced user-friendly designs for online learners through WordPress and responsive solutions`,
    contact: `Contact:<br />
      - Email: sutharmaitri0@gmail.com<br />
      - LinkedIn: https://www.linkedin.com/in/maitrisuthar/ <br />
      - GitHub: https://github.com/MS2716`,
    education: `Education:<br />
       Bachelor of Science in Information Technology (B.Sc. IT), University of Mumbai(2022 - 2025)`,
    certifications: `Certifications:<br />
      - Journey to Cloud: Envisioning Your Solution<br />
      - Getting Started with Enterprise Data Science<br />
      - SkillsBuild & IBM Cloud Platform in Emerging Technologies (AI & Cloud) Internship<br />
      <i>Edunet Foundation in collaboration with AICTE<i/>`,
    clear: "",
  };

  // Convert JSX or string to raw HTML string for TextType
  const getPlainText = (output) => {
    if (typeof output === "string") return output;
    return "";
  };

  // Helper function to extract text from HTML
  const extractTextFromHtml = (htmlString) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  // Handle input change
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Handle command submission
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const cmd = input.trim().toLowerCase();

      if (cmd === "clear") {
        setHistory([]);
        setCompletedOutputs([]);
        setIsTyping(false);
        setInput("");
        return;
      }

      if (cmd) {
        const output =
          commands[cmd] ||
          `<span class="text-red-500">Command not found: ${cmd}</span>`;
        setHistory((prev) => [...prev, { input, output }]);
        setCompletedOutputs((prev) => [...prev, false]);
        setIsTyping(true);
      } else {
        setHistory((prev) => [...prev, { input, output: "" }]);
        setCompletedOutputs((prev) => [...prev, true]);
      }

      setInput("");

      // Scroll to bottom of terminal container
      setTimeout(() => {
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      }, 0);
    }
  };

  // Callback for when typing completes for an index
  const handleComplete = (index) => {
    setCompletedOutputs((prev) => {
      const newCompleted = [...prev];
      newCompleted[index] = true;
      // Check if all outputs have completed typing
      if (newCompleted.every((completed) => completed)) {
        setIsTyping(false);
      }
      return newCompleted;
    });
  };

  // Effect to start timer for typing completion
  useEffect(() => {
    if (history.length > 0) {
      const lastIndex = history.length - 1;
      const lastItem = history[lastIndex];
      if (lastItem.output) {
        // Extract plain text from HTML for accurate character counting
        const plainText = extractTextFromHtml(lastItem.output);
        const totalChars = plainText.length;
        const typingSpeed = 10;
        const totalTime = totalChars * typingSpeed;
        setTimeout(() => {
          handleComplete(lastIndex);
        }, totalTime + 200); // Adding extra buffer for HTML parsing
      } else {
        handleComplete(lastIndex);
      }
    }
  }, [history]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div
      ref={terminalRef}
      className="bg-black text-white font-mono h-full overflow-y-auto terminal-container scrollbar-custom"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="text-left border-b border-green-700 w-full pb-2">
        <div className="text-green-500 text-sm">
          help | about | projects | skills | experience | contact | education |
          certifications | clear
        </div>
      </div>
      <div className="command-history md:pt-4 pt-2 leading-[2] tracking-wider">
        <div>
          <span className="text-blue-400 font-semibold text-[16px]">
            maitri@portfolio:~$
          </span>
          <span className="ml-2 text-green-500">welcome</span>
          <div className="mt-1 text-white font-bold">
            <span className="font-mono leading-[3]">
              Hi, I'm Maitri, a Software Developer.
            </span>
            <br />
            Welcome to my interactive portfolio terminal!
            <br />
            Type 'help' to see available commands.
          </div>
        </div>
        {history.map((item, index) => (
          <div key={index} className="mb-2">
            <div>
              <span className="text-blue-400 font-semibold text-[16px]">
                maitri@portfolio:~$
              </span>
              <span className="ml-2 text-green-500">{item.input}</span>
            </div>
            {item.output && (
              <div className="mt-1 text-white">
                {completedOutputs[index] ? (
                  <div
                    className="font-mono"
                    dangerouslySetInnerHTML={{ __html: item.output }}
                  />
                ) : (
                  <TextType
                    text={[item.output]}
                    typingSpeed={10}
                    pauseDuration={0}
                    showCursor={true}
                    cursorCharacter="|"
                    cursorClassName="text-green-400"
                    textColors={["#ffffff"]}
                    className="font-mono"
                    isHtml={true}
                    loop={false}
                    onSentenceComplete={() => handleComplete(index)}
                  />
                )}
              </div>
            )}
          </div>
        ))}
        {!isTyping && (
          <div className="flex items-center">
            <span className="text-blue-400 font-semibold text-[16px]">
              maitri@portfolio:~$
            </span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="bg-transparent outline-none text-green-500 ml-2 w-full caret-[3px]"
              style={{ caretColor: "white" }}
              autoFocus
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;
