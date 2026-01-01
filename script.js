import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ==========================================
// 1. FIREBASE CONFIGURATION
// ==========================================
const firebaseConfig = {
    apiKey: "YOUR_API_KEY", // *** อย่าลืมเปลี่ยนเป็นของคุณ ***
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Global Variables
window.allGoals = [];
window.userName = "";

// ==========================================
// 2. AUTHENTICATION (LOGIN/LOGOUT)
// ==========================================
window.login = () => signInWithPopup(auth, provider);
window.logout = () => signOut(auth);

onAuthStateChanged(auth, async (user) => {
    const loginBtn = document.getElementById('login-btn');
    const userInfo = document.getElementById('user-info');
    
    if (user) {
        loginBtn.classList.add('hidden');
        userInfo.classList.remove('hidden');
        document.getElementById('user-pic').src = user.photoURL;
        document.getElementById('user-name').innerText = user.displayName;
        
        // โหลดข้อมูลเก่าจาก Firestore
        const docRef = doc(db, "checklists", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            window.allGoals = docSnap.data().goals;
            renderLiveList();
        }
    } else {
        loginBtn.classList.remove('hidden');
        userInfo.classList.add('hidden');
    }
});

// ==========================================
// 3. NAVIGATION SYSTEM (MAIN LOGIC)
// ==========================================
// แก้ไขส่วน NAVIGATION SYSTEM ใน script.js
window.nextStep = (stepID) => {
    const currentScene = document.querySelector('.scene:not(.hidden)');
    if (currentScene) {
        currentScene.style.opacity = '0';
        currentScene.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            currentScene.classList.add('hidden');
            const nextScene = document.getElementById('step' + stepID);
            
            if (nextScene) {
                nextScene.classList.remove('hidden');
                nextScene.style.opacity = '1';
                nextScene.style.transform = 'translateY(0)';

                // ตรวจเช็คว่าต้องรัน Logic อะไรในหน้านั้นๆ
                if (stepID === 8) startEmotionalTyping();
                if (stepID == 12) startStep12(); 
                if (stepID === 'F1') startStepF1(); 
                if (stepID === 'F4') startStepF4(); 
                if (stepID === 'F4-storm') startStormSequence();
                if (stepID === 'F4-action') startStormDialogue();
                
                // *** จุดสำคัญ: หน้านี้ให้เซ็ตค่ารูปภาพและข้อความเฉยๆ ไม่ต้องเรียก nextStep ซ้ำ ***
                if (stepID === 'Magic-use') setupMagicUI(); 

                if (stepID == 7 || stepID == 10 || stepID == 'F6') shootConfetti();
            }
        }, 500);
    }
};

// ==========================================
// 4. STORY & MINI-GAME LOGIC
// ==========================================

// --- Step 8: Emotional Lines ---
const emotionalLines = [
    "ปีนี้เก่งมาก หนักแค่ไหนก็ผ่านมาได้",
    "ก่อนจะไปปีหน้า…",
    "อยู่เล่นกับเรานิดนึงไหม"
];

async function startEmotionalTyping() {
    for(let i=1; i<=3; i++) document.getElementById(`type-${i}`).innerText = "";
    const btn = document.getElementById('go-together-btn');
    btn.classList.add('hidden');

    for (let i = 1; i <= 3; i++) {
        await typeWriterEffect(`type-${i}`, emotionalLines[i-1], 100);
        await new Promise(r => setTimeout(r, 600));
    }
    btn.classList.remove('hidden');
    btn.classList.add('animate-pop');
}

// --- Step 11: Name Submission ---
window.submitName = () => {
    const input = document.getElementById('user-name-input');
    window.userName = input.value.trim() || "เธอ";
    document.getElementById('bonnie-intro-text').innerText = 
        `สวัสดีคั้บคุณ ${window.userName} เราชื่อบอนนี่ รับหน้าที่เป็นไกด์นำทางของวันนี้`;
    window.nextStep('11-intro');
};

// --- Step 12: Fantasy Narrative ---
async function startStep12() {
    const lines = [
        "อันนี้ความลับห้ามบอกใครนะ",
        "ความจริงบอนนี่เนี่ยเป็น ผู้พิทักษ์แมวอ้วน",
        "คอยดูแลสิ่งเล็กๆ เพื่อให้อาณาจักรสงบสุข"
    ];
    const container = document.getElementById('narrative-text');
    container.innerHTML = "";
    
    for (const line of lines) {
        const p = document.createElement('p');
        p.style.marginBottom = "15px";
        container.appendChild(p);
        await typeWriterEffect(p, line, 70); // element version
        await new Promise(r => setTimeout(r, 800));
    }
    document.getElementById('narrative-next-btn').classList.remove('hidden');
}

// --- Step F1: Choice Logic ---
function startStepF1() {
    createStars(); 
    const dialogue = document.getElementById('bonnie-dialogue');
    setTimeout(() => {
        dialogue.innerText = "ประตูบานนี้ไม่ได้ล็อกนะ มันแค่เปิดช้าน่ะ";
        document.getElementById('choice-container').classList.remove('hidden');
    }, 3000);
}

window.handleChoice = (type) => {
    const dialogue = document.getElementById('bonnie-dialogue');
    const choiceBtn = document.getElementById('choice-container');
    
    if (type === 'slow') {
        // ประโยคที่ 1
        updateDialogue('bonnie-dialogue', "ปกติประตูบานนี้ไม่ค่อยเปิดหรอก แต่วันนี้...");
        choiceBtn.innerHTML = ""; // ล้างปุ่มออกก่อนเพื่อให้บอนนี่พูดต่อ
        
        // เมื่อคลิกที่กล่องข้อความ ให้บอนนี่พูดประโยคที่ 2
        dialogue.onclick = () => {
            // ประโยคที่ 2 (บอนนี่เป็นคนพูด)
            updateDialogue('bonnie-dialogue', "เรามาด้วยกันนี่นา");
            
            // เมื่อคลิกอีกครั้ง ถึงจะขึ้นตัวเลือกจริงๆ ให้ผู้เล่นตอบ
            dialogue.onclick = () => {
                dialogue.onclick = null; // ปิดการคลิกที่กล่องชั่วคราว
                // เอาตัวหนังสือ "กดเพื่อไปต่อ" ออกตอนมีปุ่มตัวเลือก
                dialogue.innerHTML = "<span>เรามาด้วยกันนี่นา</span>"; 

                // ขึ้นปุ่มตัวเลือกตอบของจริง
                choiceBtn.innerHTML = `
                    <button class="choice-btn" onclick="bonnieTalk('answer1')">งั้นไปด้วยกัน</button>
                    <button class="choice-btn" onclick="bonnieTalk('answer1')">ขอบคุณที่พามานะ</button>
                `;
            };
        };
    }
};
window.bonnieTalk = (step) => {
    const dialogue = document.getElementById('bonnie-dialogue');
    const choiceBtn = document.getElementById('choice-container');

    if(step === 'answer1') {
        choiceBtn.innerHTML = ""; // ล้างปุ่ม
        updateDialogue('bonnie-dialogue', "แน่นอน... บอนนี่ไม่ปล่อยให้เดินคนเดียวอยู่แล้ว");
        
        dialogue.onclick = () => {
            updateDialogue('bonnie-dialogue', "รู้ไหม โลกข้างในไม่ได้เลือกคนเก่ง... มันเลือกคนเจ๋งๆ แบบเธอต่างหาก");
            
            dialogue.onclick = () => {
                dialogue.onclick = null;
                dialogue.innerHTML = "<span>รู้ไหม โลกข้างในไม่ได้เลือกคนเก่ง... มันเลือกคนเจ๋งๆ แบบเธอต่างหาก</span>";
                
                choiceBtn.innerHTML = `
                    <button class="choice-btn" onclick="nextStep('F2')">หึ่ยเขินนะ</button>
                    <button class="choice-btn" onclick="nextStep('F2')">โม้รึป่าว</button>
                `;
            };
        };
    }
};

window.selectedMagicItem = ""; 
// --- Step F3: เลือกของวิเศษ ---
// เก็บค่าเลือกของวิเศษ
window.chooseItem = (itemKey) => {
    window.selectedMagicItem = itemKey; // เก็บค่า 'cloak' หรือ 'light'
    
    const dialogue = document.getElementById('f3-dialogue');
    document.querySelector('.items-container').classList.add('hidden');
    
    let itemName = (itemKey === 'cloak') ? "ผ้าคลุมคืนดาว" : "ขวดแสงร่วมทาง";
    dialogue.innerText = `อืม... เลือก ${itemName} หรอ เริ่ดเลยล่ะ!`;
    
    setTimeout(() => nextStep('F4'), 2000);
};


window.partnerTalk = () => {
    const cat = document.getElementById('f4-cat');
    const box = document.getElementById('f4-dialogue');
    const choiceArea = document.getElementById('f4-choice-area');
    
    if(choiceArea) choiceArea.innerHTML = ""; 
    if(cat) cat.src = 'images/hug.png';
    
    updateDialogue('f4-dialogue', "แต่รู้อะไรมั้ย...");

    if(box) {
        box.onclick = () => {
            updateDialogue('f4-dialogue', "ไม่ว่ามองคู่ไหนเค้าเป็นยังไง แสดงออกแบบไหน แต่สำหรับบอนนี่...");
            
            box.onclick = () => {
                updateDialogue('f4-dialogue', "การเป็นตัวเองดีสุดแล้วเชื่อบอนนี่ เค้าชอบที่เธอเป็นเธอแบบนี้แหละ");
                
                box.onclick = () => {
                    if(cat) cat.src = 'images/success.png';
                    updateDialogue('f4-dialogue', "แหะๆ บอนนี่เผลอชวนดี้บทอล์ค ไปกันต่อเร็ววว");
                    box.onclick = null; // ปิดการคลิกที่กล่องข้อความ
                    
                    // สร้างปุ่มไปฉากพายุ
                    renderF4Choices([
                        { text: 'ไปกันต่อ ✨', action: "nextStep('F4-storm')" } 
                    ]);
                }; // ปิด box.onclick อันที่ 3
            }; // ปิด box.onclick อันที่ 2
        }; // ปิด box.onclick อันที่ 1
    } // ปิด if(box)
}; // ปิด window.partnerTalk

// --- Step F4: Deep Talk Flow ---
let f4State = 'start';

// ฟังก์ชันเริ่มหน้า F4
function startStepF4() {
    renderF4Choices([
        { text: 'โอเค', action: 'checkStatus("ok")' },
        { text: 'เหนื่อยนิดหน่อย', action: 'checkStatus("tired")' },
        { text: 'หนักอยู่', action: 'checkStatus("heavy")' }
    ]);
}


// ฟังก์ชันช่วยอัปเดตข้อความพร้อมใส่ตัวบอก "กดเพื่อไปต่อ"
function updateDialogue(elementId, text) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.innerHTML = `<span>${text}</span><span class="click-hint">กดเพื่อไปต่อ...</span>`;
}
// ==========================================
// 5. CHECKLIST SYSTEM
// ==========================================
window.addItem = () => {
    const input = document.getElementById('item-input');
    const text = input.value.trim();
    if (text !== "") {
        window.allGoals.push(text);
        renderLiveList();
        input.value = "";
        input.focus();
    }
};
// --- 2. ฟังก์ชันสร้างปุ่ม (แก้ไขเรื่องเครื่องหมายคำพูดที่ทำให้กดไม่ติด) ---
function renderF4Choices(choices) {
    const area = document.getElementById('f4-choice-area');
    if (!area) return;
    area.innerHTML = ""; // ล้างปุ่มเดิมออกก่อน
    
    choices.forEach(c => {
        const btn = document.createElement('button');
        btn.className = "choice-btn";
        btn.innerText = c.text;
        
        // รันคำสั่ง JS ที่อยู่ใน action ได้ทันที ไม่ว่าจะมีเครื่องหมาย ' หรือ " ก็ไม่พัง
        btn.onclick = () => {
            try {
                // สร้างฟังก์ชันชั่วคราวจากสตริง action แล้วรันมัน
                const executeAction = new Function(c.action);
                executeAction();
            } catch (error) {
                console.error("เกิดข้อผิดพลาดในการรันคำสั่ง:", c.action, error);
            }
        };
        
        area.appendChild(btn);
    });
}

// แก้ไขจุดที่ 2: เช็คฟังก์ชัน startStepF4 ให้เครื่องหมายคำพูดถูกต้อง
window.startStepF4 = () => {
    const cat = document.getElementById('f4-cat');
    if(cat) cat.src = 'images/fantacy_cat.png';
    updateDialogue('f4-dialogue', "ช่วงนี้เป็นยังไงบ้าง?");
    
    renderF4Choices([
        { text: 'โอเค', action: 'checkStatus("ok")' },
        { text: 'เหนื่อยนิดหน่อย', action: 'checkStatus("tired")' },
        { text: 'หนักอยู่', action: 'checkStatus("heavy")' }
    ]);
};

// --- 4. เช็คสถานะช่วงนี้ ---
window.checkStatus = (status) => {
    const dialogue = document.getElementById('f4-dialogue');
    const cat = document.getElementById('f4-cat');
    const choiceArea = document.getElementById('f4-choice-area');
    
    if(choiceArea) choiceArea.innerHTML = ""; // ล้างปุ่ม

    if (status === 'ok') {
        if(cat) cat.src = 'images/success.png';
        if(dialogue) dialogue.innerHTML = "<span>ดีเลยยย</span>";
    } else {
        if(cat) cat.src = 'images/hug.png';
        if(dialogue) dialogue.innerHTML = "<span>โอ๋เอ๋ มากอดบลูทูธกันมามะ</span>";
    }

    setTimeout(() => {
        if(cat) cat.src = 'images/cat_thinking.png';
        updateDialogue('f4-dialogue', "แล้วในปีที่ผ่านมามีอะไรที่ภูมิใจบ้างไหนบอกมาซิ");
        const inputArea = document.getElementById('f4-input-area');
        if(inputArea) inputArea.classList.remove('hidden');
    }, 2500);
};

window.myPrideList = [];
// --- 5. ส่งสิ่งที่ภูมิใจ ---
window.submitPride = () => {
    const input = document.getElementById('pride-input');
    const text = input.value.trim();
    
    if (text === "") return;

    // เพิ่มข้อมูลเข้า Array
    window.myPrideList.push(text);
    input.value = ""; // ล้างช่องพิมพ์
    input.focus();

    // วาดรายการใหม่
    renderPrideList();

    // โชว์ปุ่ม "ไปต่อ"
    document.getElementById('pride-next-btn').classList.remove('hidden');

    // บอนนี่ให้กำลังใจ
    const cat = document.getElementById('f4-cat');
    if(cat) cat.src = 'images/success.png';
    updateDialogue('f4-dialogue', "เก่งมากกก ได้ข่าวว่าตอนนี้ก็เป็นครูพี่เจลแล้วนี่นา");
};
function renderPrideList() {
    const container = document.getElementById('pride-list-display');
    if (!container) return;

    container.innerHTML = ""; // ล้างของเก่า
    window.myPrideList.forEach((item) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = "live-item animate-pop"; // ใช้คลาสเดิมเพื่อให้สวยเหมือน Checklist
        itemDiv.innerHTML = `<span>${item}</span>`;
        container.prepend(itemDiv); // เอาอันใหม่ไว้บนสุด
    });
}
window.finishPrideSection = () => {
    // ซ่อนโซนพิมพ์และรายการ
    document.getElementById('f4-input-area').classList.add('hidden');
    
    // เริ่มบทสนทนาถัดไป (เรื่องแฟน)
    const cat = document.getElementById('f4-cat');
    const box = document.getElementById('f4-dialogue');
    
    if(cat) cat.src = 'images/cat_eureka.png';
    updateDialogue('f4-dialogue', `เห็นว่าคุณ ${window.userName || 'เธอ'} มีแฟนแล้วใช่ม้าาา หุหุ`);
    
    // ตั้งค่าคลิกที่กล่องเพื่อไปต่อประโยคถัดไป
    box.onclick = () => {
        updateDialogue('f4-dialogue', `บอนนี่เข้าใจนะ อะไรๆ ก็คงใหม่สำหรับเธออยู่`);
        box.onclick = null; // ปิดคลิกเพื่อเลือกปุ่ม
        renderF4Choices([
            { text: 'ใช่เลย', action: 'partnerTalk()' },
            { text: 'ก็มีบ้าง', action: 'partnerTalk()' }
        ]);
    };
};

// --- 6. บทสนทนาเรื่องแฟน ---

// 1. ฟังก์ชันฉากพายุ
async function startStormSequence() {
    const container = document.getElementById('storm-narrative');
    if(!container) return;
    document.body.classList.add('storm-active'); 
    const lines = ["ทุ่งดาวเริ่มเปลี่ยน...", "ดาวไม่ลอยนิ่งเหมือนเดิม", "มีลมแรงขึ้นแบบไม่มีสัญญาณเตือน!"];
    for (let line of lines) {
        const p = document.createElement('p');
        p.className = "typewriter-text";
        container.appendChild(p);
        await typeWriterEffect(p, line, 70);
        await new Promise(r => setTimeout(r, 1000));
    }
    setTimeout(() => {
        document.body.classList.remove('storm-active');
        nextStep('F4-action');
    }, 1000);
}

// 2. ฟังก์ชันบทสนทนาพายุ
window.startStormDialogue = () => {
    const dialogue = document.getElementById('storm-dialogue');
    const choiceArea = document.getElementById('storm-choice-area');
    choiceArea.innerHTML = ""; // ล้างปุ่มก่อน

    // บรรทัดแรก
    updateDialogue('storm-dialogue', "เดี๋ยวนะ… ปกติทุ่งดาวไม่ควรจะเสียงดังขนาดนี้");

    dialogue.onclick = () => {
        // บรรทัดที่สอง
        updateDialogue('storm-dialogue', "โอ้โห… อันนี้ไม่อยู่ในแผนแน่! พายุแรงมาก");
        
        dialogue.onclick = () => {
            // หยุดการคลิกที่กล่อง และขึ้นปุ่มตัวเลือกตอบ
            dialogue.onclick = null;
            dialogue.innerHTML = "<span>โอ้โห… อันนี้ไม่อยู่ในแผนแน่! พายุแรงมาก</span>";
            
            renderF4ActionChoices([
                { text: 'เธอโอเคไหม', action: "nextStep('Magic-use')" },
                { text: 'เราน่าจะต้องผ่านตรงนี้ไปก่อนไม่งั้นเดินต่อไม่ได้เลย', action: "nextStep('Magic-use')" }
            ]);
        };
    };
};
// --- ฟังก์ชันเตรียมหน้าโชว์ไอเทม ---
function setupMagicUI() {
    const itemImg = document.getElementById('magic-item-img');
    const itemNameEl = document.getElementById('magic-item-name');
    const useBtn = document.getElementById('use-item-btn');

    if (window.selectedMagicItem === 'cloak') {
        itemImg.src = "images/magic1.png";
        itemNameEl.innerText = "🌙 ผ้าคลุมคืนดาว";
    } else {
        itemImg.src = "images/magic2.png";
        itemNameEl.innerText = "✨ ขวดแสงร่วมทาง";
    }

    useBtn.onclick = () => runMagicSequence();
}

// --- ฟังก์ชันรันเหตุการณ์หลังใช้ไอเทม ---
async function runMagicSequence() {
    nextStep('Magic-result');
    const container = document.getElementById('magic-result-text');
    container.innerHTML = "";
    const magicBG = document.getElementById('stepMagic-result');
    magicBG.style.backgroundImage = "url('images/bg5.png')";

    if (window.selectedMagicItem === 'cloak') {
        // --- PATH: ผ้าคลุม ---
        const lines = ["ผ้าคลุมคืนดาวเริ่มปลิวเอง", "คลุมทั้งคุณและบอนนี่..."];
        for (let l of lines) {
            const p = document.createElement('p');
            p.className = "typewriter-text";
            container.appendChild(p);
            await typeWriterEffect(p, l, 60);
            await new Promise(r => setTimeout(r, 1000));
        }
        
        const btn = document.createElement('button');
        btn.className = "next-btn btn-pop";
        btn.innerText = "กดเพื่อไปต่อ ✨";
        btn.onclick = () => startCloakPath();
        container.appendChild(btn);

    } else {
        // --- PATH: ขวดแสง ---
        const lines = ["ขวดแสงสั่นเบา ๆ แสงลอยออกมา", "เชื่อมช่องว่างเป็น สะพานแสง"];
        for (let l of lines) {
            const p = document.createElement('p');
            p.className = "typewriter-text";
            container.appendChild(p);
            await typeWriterEffect(p, l, 60);
            await new Promise(r => setTimeout(r, 1000));
        }

        const btn = document.createElement('button');
        btn.className = "next-btn btn-pop";
        btn.innerText = "กดเพื่อไปต่อ ✨";
        btn.onclick = () => startLightPath();
        container.appendChild(btn);
    }
}

// --- PATH ผ้าคลุม ---
function startCloakPath() {
    nextStep('F5');
    const cat = document.getElementById('f5-cat');
    const dialogue = document.getElementById('f5-dialogue');
    cat.src = "images/sad_cat.png";
    updateDialogue('f5-dialogue', "ถ้าเราวิ่งฝ่ามันไป มีหวังล้มแน่ ๆ!");
    
    dialogue.onclick = () => {
        document.getElementById('stepF5').style.backgroundImage = "url('images/bg6.png')";
        cat.src = "images/fantacy_cat.png";
        updateDialogue('f5-dialogue', "ว้าว… แปลว่าบางอุปสรรค");
        
        dialogue.onclick = () => {
            updateDialogue('f5-dialogue', "ไม่ได้ต้องเอาชนะด้วยความเร็ว");
            
            dialogue.onclick = () => {
                cat.src = "images/sad_cat2.png"; // เปลี่ยนเป็นรูปเหนื่อยๆ
                updateDialogue('f5-dialogue', "โอ๊ย แต่บอนนี่ขอลา");
                dialogue.onclick = () => startFinalEndingTalk();
            };
        };
    };
}

// --- PATH ขวดแสง ---
function startLightPath() {
    nextStep('F5');
    const cat = document.getElementById('f5-cat');
    const dialogue = document.getElementById('f5-dialogue');
    cat.src = "images/sad_cat.png";
    updateDialogue('f5-dialogue', "กระโดดคนเดียว… ไม่น่ารอดนะ");

    dialogue.onclick = () => {
        updateDialogue('f5-dialogue', "แต่แสงไม่พอถ้าถือคนเดียว บอนนี่ต้องช่วยถือปลายอีกด้าน");
        
        dialogue.onclick = () => {
            updateDialogue('f5-dialogue', "บอนนี่: โอเค เรามาด้วยกัน!");
            
            dialogue.onclick = () => {
                updateDialogue('f5-dialogue', "สะพานแสงสว่างพอดี");
                document.getElementById('stepF5').style.backgroundImage = "url('images/bg6.png')";
                cat.src = "images/success.png";
                
                dialogue.onclick = () => {
                    updateDialogue('f5-dialogue', "เย้ ๆ ๆ");
                    
                    dialogue.onclick = () => {
                        cat.src = "images/hug.png";
                        updateDialogue('f5-dialogue', "อุปสรรคผ่านไปแล้ว แต่โลกกลับดูดีขึ้น");
                        dialogue.onclick = () => startFinalEndingTalk();
                    };
                };
            };
        };
    };
}
// --- ฉากจบสุดท้าย (Step F5 ต่อ) ---
function startFinalEndingTalk() {
    const cat = document.getElementById('f5-cat');
    const dialogue = document.getElementById('f5-dialogue');
    const choiceArea = document.getElementById('f5-choice-area');
    
    cat.src = "images/final_cat.png";
    updateDialogue('f5-dialogue', "ยอมรับเลยนะ ตอนแรกบอนนี่ก็กลัวเหมือนกัน");
    
    dialogue.onclick = () => {
        cat.src = "images/fantacy_cat.png";
        updateDialogue('f5-dialogue', "แต่พอรู้ว่า ไม่ได้เดินคนเดียว");
        
        dialogue.onclick = () => {
            updateDialogue('f5-dialogue', "มันก็ไม่ได้น่ากลัวขนาดนั้น");
            
            dialogue.onclick = () => {
                updateDialogue('f5-dialogue', "แล้วมันน่ากลัวมั้ยสำหรับเธอ?");
                dialogue.onclick = null;
                choiceArea.innerHTML = `
                    <button class="choice-btn" onclick="finishAllDialogues()">ไม่เท่าไหร่หรอก</button>
                    <button class="choice-btn" onclick="finishAllDialogues()">มีเธอก็อุ่นใจ</button>
                `;
            };
        };
    };
}

window.finishAllDialogues = () => {
    document.getElementById('f5-choice-area').innerHTML = "";
    const dialogue = document.getElementById('f5-dialogue');
    
    updateDialogue('f5-dialogue', "ตอนแรกบอนนี่ก็คิดว่า...");
    dialogue.onclick = () => {
        updateDialogue('f5-dialogue', "ต้องเก่ง ต้องนิ่ง ต้องไม่กลัว ถึงจะเดินต่อได้");
        dialogue.onclick = () => {
            updateDialogue('f5-dialogue', "แต่พอมีเธอเดินอยู่ตรงนี้ บอนนี่ถึงรู้ว่ากลัวได้ก็ไม่เป็นไร");
            dialogue.onclick = () => {
                nextStep('F6');
            };
        };
    };
};
// ฟังก์ชันช่วยสร้างปุ่มตัวเลือก
function renderF4ActionChoices(choices) {
    const area = document.getElementById('storm-choice-area');
    area.innerHTML = "";
    choices.forEach(c => {
        const btn = document.createElement('button');
        btn.className = "choice-btn";
        btn.innerText = c.text;
        btn.onclick = () => new Function(c.action)();
        area.appendChild(btn);
    });
}
// --- 2. เตรียมใช้ไอเทมวิเศษ ---
window.prepareMagic = () => {
    const itemImg = document.getElementById('magic-item-img');
    const itemNameEl = document.getElementById('magic-item-name');
    const useBtn = document.getElementById('use-item-btn');

    // ตรวจสอบว่าเลือกไอเทมอะไรมา (อิงจากปุ่มหน้า F3)
    if (window.selectedMagicItem === 'cloak') {
        itemImg.src = "images/magic1.png"; // รูปผ้าคลุม
        itemNameEl.innerText = "🌙 ผ้าคลุมคืนดาว";
    } else {
        itemImg.src = "images/magic2.png"; // รูปขวดแสง
        itemNameEl.innerText = "✨ ขวดแสงร่วมทาง";
    }

    // เมื่อกดปุ่มใช้ไอเทม
    useBtn.onclick = () => runMagicSequence();

    // เปลี่ยนหน้าไปที่หน้าโชว์ไอเทม
    nextStep('Magic-use');
};



// --- 4. ฉากสรุป Path: ผ้าคลุม ---
function startCloakEnding() {
    nextStep('F5');
    const cat = document.getElementById('f5-cat');
    cat.src = "images/sad_cat.png";
    updateDialogue('f5-dialogue', "ถ้าเราวิ่งฝ่ามันไป มีหวังล้มแน่ ๆ!");
    
    document.getElementById('f5-dialogue').onclick = () => {
        document.getElementById('stepF5').style.backgroundImage = "url('images/bg6.png')";
        cat.src = "images/fantacy_cat.png";
        
        const dialogueLines = [
            "ว้าว… แปลว่าบางอุปสรรค",
            "ไม่ได้ต้องเอาชนะด้วยความเร็ว",
            "โอ๊ย แต่บอนนี่ขอลา"
        ];
        
        let i = 0;
        updateDialogue('f5-dialogue', dialogueLines[i]);
        
        document.getElementById('f5-dialogue').onclick = () => {
            i++;
            if (i < dialogueLines.length) {
                if(i === 2) cat.src = "images/fantasy_cat3.png"; // หรือรุปอื่นที่คุณต้องการ
                updateDialogue('f5-dialogue', dialogueLines[i]);
            } else {
                startFinalDeepTalk();
            }
        };
    };
}

// --- 5. ฉากสรุป Path: ขวดแสง ---
function startLightEnding() {
    nextStep('F5');
    const cat = document.getElementById('f5-cat');
    const dialogueBox = document.getElementById('f5-dialogue');
    cat.src = "images/sad_cat.png";
    
    updateDialogue('f5-dialogue', "กระโดดคนเดียว… ไม่น่ารอดนะ");

    dialogueBox.onclick = () => {
        updateDialogue('f5-dialogue', "แต่แสงไม่พอถ้าถือคนเดียว บอนนี่ต้องช่วยถือปลายอีกด้าน");
        
        dialogueBox.onclick = () => {
            updateDialogue('f5-dialogue', "บอนนี่: โอเค เรามาด้วยกัน!");
            
            dialogueBox.onclick = () => {
                document.getElementById('stepF5').style.backgroundImage = "url('images/bg6.png')";
                updateDialogue('f5-dialogue', "สะพานแสงสว่างพอดี");
                cat.src = "images/success.png";
                
                dialogueBox.onclick = () => {
                    updateDialogue('f5-dialogue', "เย้ ๆ ๆ");
                    
                    dialogueBox.onclick = () => {
                        cat.src = "images/hug.png";
                        updateDialogue('f5-dialogue', "อุปสรรคผ่านไปแล้ว แต่โลกกลับดูดีขึ้น");
                        dialogueBox.onclick = () => startFinalDeepTalk();
                    };
                };
            };
        };
    };
}
// --- 6. บทสรุปความรู้สึก (Step F5 - Final Talk) ---
function startFinalDeepTalk() {
    const cat = document.getElementById('f5-cat');
    const dialogueBox = document.getElementById('f5-dialogue');
    const choiceArea = document.getElementById('f5-choice-area');
    
    cat.src = "images/final_cat.png";
    updateDialogue('f5-dialogue', "ยอมรับเลยนะ ตอนแรกบอนนี่ก็กลัวเหมือนกัน");
    
    dialogueBox.onclick = () => {
        cat.src = "images/fantacy_cat.png";
        updateDialogue('f5-dialogue', "แต่พอรู้ว่า ไม่ได้เดินคนเดียว");
        
        dialogueBox.onclick = () => {
            updateDialogue('f5-dialogue', "มันก็ไม่ได้น่ากลัวขนาดนั้น");
            
            dialogueBox.onclick = () => {
                updateDialogue('f5-dialogue', "แล้วมันน่ากลัวมั้ยสำหรับเธอ?");
                dialogueBox.onclick = null;
                
                // ให้ผู้เล่นเลือกตอบ
                choiceArea.innerHTML = `
                    <button class="choice-btn" onclick="finishStory()">ไม่เท่าไหร่หรอก</button>
                    <button class="choice-btn" onclick="finishStory()">มีเธอก็อุ่นใจ</button>
                `;
            };
        };
    };
}

// --- 7. ปิดท้ายเรื่องราว ---
window.finishStory = () => {
    const dialogueBox = document.getElementById('f5-dialogue');
    document.getElementById('f5-choice-area').innerHTML = "";
    
    const finalLines = [
        "ตอนแรกบอนนี่ก็คิดว่า",
        "ต้องเก่ง ต้องนิ่ง ต้องไม่กลัว ถึงจะเดินต่อได้",
        "แต่พอมีเธอเดินอยู่ตรงนี้ บอนนี่ถึงรู้ว่ากลัวได้ก็ไม่เป็นไร"
    ];
    
    let i = 0;
    updateDialogue('f5-dialogue', finalLines[i]);
    
    dialogueBox.onclick = () => {
        i++;
        if (i < finalLines.length) {
            updateDialogue('f5-dialogue', finalLines[i]);
        } else {
            nextStep('F6');
            shootConfetti();
        }
    };
};


// --- Logic การใช้ไอเทมแต่ละชิ้น ---
async function useMagicLogic() {
    nextStep('Magic-result');
    const resultContainer = document.getElementById('magic-result-text');
    const magicBG = document.getElementById('step-magic-result');

    if (window.selectedMagicItem === 'cloak') { 
        magicBG.style.backgroundImage = "url('images/bg5.png')";
        const lines = ["ผ้าคลุมคืนดาวเริ่มปลิวเอง", "คลุมทั้งคุณและบอนนี่..."];
        for(let l of lines) {
            const p = document.createElement('p');
            p.className = "typewriter-text";
            resultContainer.appendChild(p);
            await typeWriterEffect(p, l, 70);
            await new Promise(r => setTimeout(r, 1000));
        }
        
        const btn = document.createElement('button');
        btn.className = "next-btn btn-pop";
        btn.innerText = "กดเพื่อไปต่อ ✨";
        btn.onclick = () => showCloakEnding();
        resultContainer.appendChild(btn);

    } else {
        magicBG.style.backgroundImage = "url('images/bg5.png')";
        const lines = ["ขวดแสงสั่นเบา ๆ แสงลอยออกมา", "เชื่อมช่องว่างเป็น สะพานแสง"];
        for(let l of lines) {
            const p = document.createElement('p');
            p.className = "typewriter-text";
            resultContainer.appendChild(p);
            await typeWriterEffect(p, l, 70);
            await new Promise(r => setTimeout(r, 1000));
        }

        const btn = document.createElement('button');
        btn.className = "next-btn btn-pop";
        btn.innerText = "กดเพื่อไปต่อ ✨";
        btn.onclick = () => showLightEnding();
        resultContainer.appendChild(btn);
    }
}

// --- ฉากจบย่อย: ผ้าคลุม ---
function showCloakEnding() {
    nextStep('F5');
    document.getElementById('f5-cat').src = 'images/sad_cat.png';
    updateDialogue('f5-dialogue', "ถ้าเราวิ่งฝ่ามันไป มีหวังล้มแน่ๆ!");
    
    const choiceArea = document.getElementById('f5-choice-area');
    choiceArea.innerHTML = `<button class="choice-btn" onclick="finishF5('cloak')">พยายามเข้านะ</button>`;
}

// --- ฉากจบย่อย: ขวดแสง ---
function showLightEnding() {
    nextStep('F5');
    document.getElementById('f5-cat').src = 'images/sad_cat.png';
    updateDialogue('f5-dialogue', "แต่แสงไม่พอถ้าถือคนเดียว บอนนี่ต้องช่วยถือปลายอีกด้าน");
    
    const choiceArea = document.getElementById('f5-choice-area');
    choiceArea.innerHTML = `<button class="choice-btn" onclick="finishF5('light')">เรามาด้วยกัน!</button>`;
}

// --- Step F5: บทสนทนาสุดท้ายก่อนจบ ---
window.finishF5 = (type) => {
    const dialogue = document.getElementById('f5-dialogue');
    const cat = document.getElementById('f5-cat');
    const choiceArea = document.getElementById('f5-choice-area');
    choiceArea.innerHTML = "";

    if (type === 'cloak') {
        cat.src = 'images/fantacy_cat.png';
        updateDialogue('f5-dialogue', "ว้าว… แปลว่าบางอุปสรรค ไม่ได้ต้องเอาชนะด้วยความเร็วเสมอไป");
    } else {
        cat.src = 'images/success.png';
        updateDialogue('f5-dialogue', "สะพานแสงสว่างพอดีเลย! เราข้ามมาได้แล้ว");
    }

    dialogue.onclick = () => {
        cat.src = 'images/final_cat.png';
        updateDialogue('f5-dialogue', "แต่พอรู้ว่าไม่ได้เดินคนเดียว มันก็ไม่ได้น่ากลัวขนาดนั้นแล้วล่ะ");
        dialogue.onclick = () => {
            updateDialogue('f5-dialogue', "แล้วมันน่ากลัวมั้ยสำหรับเธอ?");
            choiceArea.innerHTML = `
                <button class="choice-btn" onclick="finalDeepTalk()">ไม่เท่าไหร่นะ</button>
                <button class="choice-btn" onclick="finalDeepTalk()">มีเธอก็โอเค</button>
            `;
        };
    };
};

window.finalDeepTalk = () => {
    const dialogue = document.getElementById('f5-dialogue');
    const choiceArea = document.getElementById('f5-choice-area');
    choiceArea.innerHTML = "";
    
    updateDialogue('f5-dialogue', "ตอนแรกบอนนี่คิดว่าต้องเก่ง ต้องนิ่ง ถึงจะเดินต่อได้...");
    dialogue.onclick = () => {
        updateDialogue('f5-dialogue', "แต่พอมีเธอเดินอยู่ตรงนี้ บอนนี่ถึงรู้ว่ากลัวได้ก็ไม่เป็นไร");
        dialogue.onclick = () => {
            nextStep('F6'); // ไปหน้า Happy Ending
            shootConfetti();
        };
    };
};

window.flipFinalCard = () => {
    document.getElementById('final-card-inner').classList.toggle('flipped');
};

function renderLiveList() {
    const listContainer = document.getElementById('live-list-container');
    if(!listContainer) return;
    listContainer.innerHTML = "";
    window.allGoals.forEach((goal, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = "live-item animate-pop";
        itemDiv.innerHTML = `<span>${goal}</span><button class="del-btn" onclick="removeItem(${index})">✕</button>`;
        listContainer.prepend(itemDiv);
    });
}

window.removeItem = (index) => {
    window.allGoals.splice(index, 1);
    renderLiveList();
};

window.showSummary = () => {
    if (window.allGoals.length === 0) {
        showModal("พิมพ์สิ่งที่อยากทำด้วยกันก่อนน้าา ✨");
        return;
    }
    const summaryList = document.getElementById('final-summary-list');
    summaryList.innerHTML = "";
    window.allGoals.forEach(goal => {
        const item = document.createElement('div');
        item.className = "summary-item animate-pop";
        item.textContent = "✅ " + goal;
        summaryList.appendChild(item);
    });
    window.nextStep(10);
};

window.saveToFirebase = async () => {
    const user = auth.currentUser;
    if (!user) { showModal("อย่าลืม Login ก่อนบันทึกนะ ❤️"); return; }
    const statusText = document.getElementById('save-status');
    statusText.innerText = "กำลังบันทึก... ⏳";
    try {
        await setDoc(doc(db, "checklists", user.uid), { goals: window.allGoals, updatedAt: new Date() });
        statusText.innerText = "บันทึกเรียบร้อยแล้ว! ✨";
        statusText.style.color = "#27ae60";
        shootConfetti();
    } catch (e) {
        statusText.innerText = "เกิดข้อผิดพลาด ลองใหม่นะ";
        statusText.style.color = "#c0392b";
    }
};


// ==========================================
// 6. VISUAL EFFECTS (SNOW, STARS, MODAL)
// ==========================================

// Typewriter Engine (รองรับทั้ง ID และ Element)
function typeWriterEffect(target, text, speed) {
    return new Promise(resolve => {
        let i = 0;
        const el = (typeof target === 'string') ? document.getElementById(target) : target;
        el.innerText = "";
        const timer = setInterval(() => {
            el.innerText += text[i];
            i++;
            if (i >= text.length) { clearInterval(timer); resolve(); }
        }, speed);
    });
}

// Modal System
function showModal(msg) {
    const modal = document.getElementById('custom-modal');
    document.getElementById('modal-text').innerText = msg;
    modal.classList.remove('hidden');
}
window.closeModal = () => document.getElementById('custom-modal').classList.add('hidden');

// Flip Card
window.flipCard = () => {
    document.getElementById('card-inner').classList.toggle('flipped');
    document.getElementById('card-next-btn').classList.remove('hidden');
};

// Snow System
window.toggleSnow = () => {
    const container = document.getElementById('snow-container');
    const btn = document.getElementById('snow-toggle');
    if (container.innerHTML === "") {
        createSnow();
        btn.innerHTML = '❄️ On';
    } else {
        container.innerHTML = "";
        btn.innerHTML = '❄️ Off';
    }
};

function createSnow() {
    const container = document.getElementById('snow-container');
    for (let i = 0; i < 40; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.innerHTML = '❄️';
        snowflake.style.left = Math.random() * 100 + 'vw';
        snowflake.style.animationDuration = Math.random() * 3 + 2 + 's';
        snowflake.style.opacity = Math.random();
        container.appendChild(snowflake);
    }
}

// Star Effect
function createStars() {
    const container = document.getElementById('star-container');
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const star = document.createElement('div');
            star.className = 'magic-star'; star.innerHTML = '✨';
            star.style.left = Math.random() * 100 + 'vw';
            star.style.top = Math.random() * 100 + 'vh';
            container.appendChild(star);
            setTimeout(() => star.remove(), 2000);
        }, i * 200);
    }
}

function shootConfetti() {
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
}

// Initialize
window.onload = createSnow;