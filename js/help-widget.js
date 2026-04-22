(function () {
    const container = document.getElementById("help");
    if (!container) return;

    container.innerHTML = `
    <button id="helpBtn">💬 Help</button>

    <div id="helpModal" class="help-hidden">
      <div class="help-box">
        <h3>Need Help?</h3>
        <textarea id="helpMessage" placeholder="Describe your issue..."></textarea>
        <input id="helpEmail" placeholder="Email (optional)" />
        <button id="sendHelp">Send</button>
      </div>
    </div>
  `;

    // Styles (inject once)
    const style = document.createElement("style");
    style.innerHTML = `
    #helpBtn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--cyan);
      color: white;
      border: none;
      padding: 12px 16px;
      border-radius: 50px;
      font-weight: 600;
      cursor: pointer;
      z-index: 9999;
    }

    #helpModal {
      position: fixed;
      bottom: 80px;
      right: 10px;
      width: 300px;
      background: var(--white);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      padding: 16px;
      z-index: 9999;
    }

    .help-hidden {
      display: none;
    }

    .help-box textarea,
    .help-box input {
      width: 100%;
      margin: 8px 0;
      padding: 8px;
    }

    .help-box button {
      width: 100%;
      background: var(--cyan);
      color: white;
      border: none;
      padding: 10px;
      border-radius: 8px;
      cursor: pointer;
    }
  `;
    document.head.appendChild(style);

    // Logic
    const helpBtn = document.getElementById("helpBtn");
    const helpModal = document.getElementById("helpModal");
    const sendHelp = document.getElementById("sendHelp");

    helpBtn.onclick = () => {
        helpModal.classList.toggle("help-hidden");
    };

    sendHelp.onclick = async () => {
        const message = document.getElementById("helpMessage").value.trim();
        const email = document.getElementById("helpEmail").value.trim();

        if (!message) {
            showGlobalToast("Please describe your issue");
            return;
        }

        const userId = window.getOrCreateUserId
            ? window.getOrCreateUserId()
            : "anonymous";

        const data = {
            userId,
            message,
            email,
            page: window.location.href,
            userAgent: navigator.userAgent,
            createdAt: new Date().toISOString()
        };

        if (window.saveHelpRequest) {
            await window.saveHelpRequest(data);
        } else {
            console.warn("saveHelpRequest not defined", data);
        }

        showGlobalToast("Thanks! We'll look into it.");

        localStorage.setItem("hasOpenIssue", "true")
        helpModal.classList.add("help-hidden");
    };
})();