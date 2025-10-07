const nameInputScreen = document.getElementById('name-input-screen');
const playerNameInput = document.getElementById('player-name-input');
const confirmNameButton = document.getElementById('confirm-name-button');
const sceneBackground = document.getElementById('scene-background');

// --- Game Data (Scenes) ---
const gameScenes = {
    "scene_001": {
        "id": "scene_001",
        "title": "คืนแรก",
        "background_image": "images/backgrounds/night.png",
        "steps": [
            {
                "id": "s1",
                "text": "🌙 แสงจันทร์คืนนี้อบอุ่นกว่าทุกคืนที่เคยมี… ท่ามกลางหมู่หญ้า มีเงาขาวขยับเบาๆ — 'คุณเป็นใคร... ได้ยินเสียงเราไหม?'",
                "character_pose": "beg",
                "interaction": {
                    "type": "choices",
                    "choices": [
                        { "id": "c1", "label": "เราหลงทางมาน่ะ... ", "effects": { "relationship": 5, "tags": { "gentle": 0 } } },
                        { "id": "c2", "label": "เราชื่อ [ชื่อเรา] เธอคือ...", "effects": { "relationship": 5, "tags": { "playful": 0 } } },
                        { "id": "c3", "label": "เราแค่เผลอเดินตามแสงบางอย่างมา… หรืออาจจะเป็นเธอก็ได้?", "effects": { "relationship": 5, "tags": { "playful": 0 } } }
                    ]
                }
            },
            {
                "id": "s2",
                "text": "อ๋าาาา เราชื่อบันนี่นะ ยินดีที่ได้รู้จักคั้บ! ><",
                "character_pose": "happy",
                "interaction": {
                    "type": "choices",
                    "choices": [
                        { "id": "c3", "label": "ยินดีที่ได้รู้จักเช่นกันน้า", "effects": { "relationship": 6, "tags": { "peaceful": 2, "romantic": 1 } } }
                    ]
                }
            },
            {
                "id": "s3",
                "text": "บันนี่กำลังตามหาพระจันทร์อยู่น่ะ เดินทางไปกับบันนี่นะ",
                "character_pose": "happy",
                "interaction": {
                    "type": "choices",
                    "choices": [
                        { "id": "c5", "label": "><", "effects": { "relationship": 4, "tags": { "peaceful": 2, "romantic": 1 } } }
                    ]
                }
            },
            {
                "id": "s4",
                "text": "ในขณะที่กำลังเดินสำรวจอยู่นั้น... ดันพบกับ !",
                "interaction": {
                    "type": "choices",
                    "choices": [
                        { "id": "c5", "label": "กับ ??", "effects": { "relationship": 4, "tags": { "peaceful": 2, "adventurous": 2 } } }
                    ]
                }
            },
            {
                "id": "s5",
                "text": "มีทางอยู่สองทาง ทางหิ่งห้อย หรือ ทางลำธาร — เธอจะเลือกไปทางไหน?",
                "interaction": {
                    "type": "choices",
                    "choices": [
                        { "id": "c4", "label": "ไปทางหิ่งห้อยสิ คิดว่ามันดูอบอุ่นดี", "effects": { "relationship": 7, "tags": { "romantic": 3, "adventurous": 2, "playful": 2 } } },
                        { "id": "c5", "label": "ไปทางลำธาร เราอยากฟังเสียงน้ำกับลม", "effects": { "relationship": 7, "tags": { "peaceful": 3, "adventurous": 2, "playful": 2 } } }
                    ]
                }
            },
            {
                "id": "s6",
                "text": "งั้นไปกันต่อออออ ",
                "character_pose": "walk",
                "interaction": {
                    "type": "choices", 
                    "choices": [
                        { "id": "c7", "label": "Go! Go!", "effects": { "relationship": 5, "tags": { "adventurous": 3, "playful": 3 } } }, // เพิ่ม id และ effects
                    ]
                }
            },
            {
                "id": "s7",
                "text": "บันนี่มีคำถามน่ะ ถ้าเธอกลายเป็นสัตว์ได้หนึ่งวัน... อยากเป็นสัตว์อะไร?",
                "character_pose": "curious",
                "interaction": {
                    "type": "choices", 
                    "choices": [
                        { "id": "c6", "label": "เจ้าเหมียว", "effects": { "relationship": 6, "tags": { "playful": 2 } } }, 
                        { "id": "c7", "label": "น้องม๋า", "effects": { "relationship": 6, "tags": { "playful": 2 } } }, 
                        { "id": "c8", "label": "น้อนกระต่าย", "effects": { "relationship": 6, "tags": { "playful": 2 } } } 
                    ]
                }
            },
            {
                "id": "s8",
                "text": "แล้วเวลาว่างของเธอ... ชอบทำอะไรเป็นพิเศษหรอ?",
                "character_pose": "curious",
                "interaction": {
                    "type": "open_text",
                    "save_as": "free_time",
                    "effects_map": { "default": { "relationship": 5 } }
                }
            },
            {
                "id": "s9",
                "text": "อ๋าาา เยี่ยมเลยยย แต่ตอนนี้บันนี่ว่าเราพักกันก่อนดีกว่า",
                "character_pose": "walk",
                "interaction": {
                    "type": "choices",
                    "choices": [
                        { "id": "c5", "label": "😴😴", "effects": { "relationship": 5, "tags": { "peaceful": 2, "adventurous": 1 } } }
                    ]
                }
            },
        ],
        "end": { "text": "ฝันดีนะ 'ไว้พรุ่งนี้ เราจะเริ่มตามหาดวงจันทร์ของเราด้วยกันต่อ!'", "effects": { "relationship": 3 }, "next_scene": "scene_002" }
    },
    // --- Sample Scene 2: ทุ่งดอกไม้จันทรา ---
    "scene_002": {
        "id": "scene_002",
        "background_image": "images/backgrounds/morning.png",
        "title": "ทุ่งดอกไม้มหัศจรรย์",
        "steps": [
            {
                "id": "s1",
                "text": "🌸 เช้าตรู่ในทุ่งดอกไม้มหัศจรรย์ บันนี่ชวนคุณไปเก็บดอกไม้พิเศษ",
                "character_pose": "happy",
                "interaction": {
                    "type": "choices",
                    "choices": [
                        { "id": "c1", "label": "เก็บดอกไม้ด้วยกันดีกว่า", "effects": { "relationship": 5, "tags": { "romantic": 3 } } },
                        { "id": "c2", "label": "รอดูเฉยๆ", "effects": { "relationship": 2, } }
                    ]
                }
            },
            {
                "id": "s2",
                "text": "เอ๊ะ! ดอกนี้สวยจัง ถ้าดอกนี้มีความหมายในใจของเธอสักอย่าง เธออยากให้มันหมายถึงอะไร?",
                "character_pose": "flower",
                "interaction": {
                    "type": "choices",
                    "choices": [
                        { "id": "c1", "label": "ความอ่อนโยนที่ฮีลใจได้เสมอ", "effects": { "relationship": 3, "tags": { "peaceful": 2, "romantic": 2 } } },
                        { "id": "c2", "label": "ความทรงจำที่อยากเก็บไว้ตลอดไป", "effects": { "relationship": 3, "tags": { "peaceful": 2, "romantic": 2 } } },
                        { "id": "c3", "label": "ความรักที่บริสุทธิ์", "effects": { "relationship": 5, "tags": { "peaceful": 2, "romantic": 2 } } }
                    ]
                }
            },
            {
                "id": "s3",
                "text": "ถ้าเธอสามารถเสกสิ่ง ๆ หนึ่งให้ใครสักคน... อยากจะให้อะไร?",
                "character_pose": "happy",
                "interaction": {
                    "type": "choices",
                    "choices": [
                        { "id": "c1", "label": "ความสุข", "effects": { "relationship": 5, "tags": { "peaceful": 2, "romantic": 3 } } },
                        { "id": "c2", "label": "ความสบาย", "effects": { "relationship": 5, "tags": { "peaceful": 2, "romantic": 3 } } },
                        { "id": "c3", "label": "ของอร่อย", "effects": { "relationship": 5, "tags": { "peaceful": 2, "romantic": 3 } } }
                    ]
                    
                }
            },
            {
                "id": "s4",
                "text": "เธอนี่เกิดมาน่ารักจังเลยน้า ใครที่ได้รู้จักเธอคงโชคดีมาก ๆ ",
                "character_pose": "beg",
                "interaction": {
                    "type": "choices",
                    "choices": [
                        { "id": "c1", "label": "(≧ω≦)", "effects": { "relationship": 2, "tags": { "peaceful": 2 } } },
                    ]
                    
                }
            },
            {
                "id": "s5",
                "text": "หวังว่าบันนี่จะเป็นคนโชคดีคนนั้น (~ ¯▽¯) ~",
                "character_pose": "happy",
                "interaction": {
                    "type": "choices",
                    "choices": [
                        { "id": "c1", "label": "ได้เสมอ", "effects": { "relationship": 6, "tags": { "peaceful": 2, "romantic": 3 } } },
                        { "id": "c1", "label": "อาจจะต้องใช้เวลานะบันนี่", "effects": { "relationship": 3, } },
                    ]
                    
                }
            }
        ],
        "end": { "text": "บันนี่มีความสุขมากกับดอกไม้ที่คุณเก็บให้... เราไปกันต่อเถอะ!", "effects": { "relationship": 5 }, "next_scene": "scene_003" }
    },
    // --- Sample Scene 3: บ่อน้ำสะท้อนใจ ---
    "scene_003": {
        "id": "scene_003",
        "title": "บ่อน้ำสะท้อนใจ",
        "background_image": "images/backgrounds/morning.png",
        "steps": [
            {
                "id": "s1",
                "text": "💧 เดินทางมาถึงบ่อน้ำที่สะท้อนแสงจันทร์ บันนี่ดูเหม่อลอยไป",
                "character_pose": "walk",
                "interaction": {
                    "type": "choices",
                    "choices": [
                        { "id": "c1", "label": "...", "effects": { "relationship": 2, "tags": { "peaceful": 0 } } }
                    ]
                }
            },
            {
                "id": "s2",
                "text": "ฮึก... 😢 ",
                "character_pose": "beg",
                "interaction": {
                    "type": "choices",
                    "choices": [
                        { "id": "c1", "label": "เป็นอะไรรึป่าว?", "effects": { "relationship": 5, "tags": { "gentle": 10 } } },
                        { "id": "c2", "label": "...", "effects": { "relationship": 2, "tags": { "peaceful": 0 } } }
                    ]
                }
            },
            {
                "id": "s3",
                "text": "เวลาเธอรู้สึกไม่ดี... เธอปลอบใจตัวเองยังไง?'",
                "character_pose": "sad",
                "interaction": {
                    "type": "open_text",
                    "save_as": "free_time",
                    "effects_map": { "default": { "relationship": 10 } }
                }
            },

        ],
        "end": {
            "text": "บันนี่รู้สึกดีขึ้นที่ได้ระบายกับคุณ... ความผูกพันของพวกเราน่ารักกันมาก",
            "effects": { "relationship": 10 },
            "next_scene": "final_ending_moon_conquered" // ชี้ไปที่ฉากจบ Full Image
        }
    },
    // NEW: ฉากจบแบบ Full-Image
    "final_ending_moon_conquered": {
        "id": "final_ending_moon_conquered",
        "title": "Ending A: สำเร็จ!",
        "message": "คุณได้พบดวงจันทร์ของบันนี่และเดินทางด้วยกันไป... ขอบคุณที่เปิดใจและร่วมทางกันมาตลอดเส้นทางนี้! (ความใกล้ชิด: [relationship]/100)", // ใช้ [relationship] placeholder
        "image": "images/endings/moon_conquered.png", // *** แก้ไขนามสกุลเป็น .png ที่นี่ ***
        "type": "full_image_ending" // ใช้เพื่อระบุว่าเป็นตอนจบแบบพิเศษ
    }
};

// --- Game State ---
let gameState = {
    userId: generateUniqueId(),
    relationship: 0,
    personality_tags: {
        gentle: 0,
        playful: 0,
        romantic: 0,
        adventurous: 0,
        peaceful: 0,
        creative: 0
    },
    profile_answers: {
        playerName: null, // New field for player name if captured
        favorite_animal: null,
        free_time: null,
        gift_preference: null,
        self_comfort: null
    },
    current_scene_id: "scene_001",
    current_step_index: 0,
    history: [], // Stores { scene_id, step_id, choice_id/open_answer_text, timestamp, player_action_text }
    current_displayed_chat_bubbles: 0, // To manage fade-in animations on re-render
    current_character_pose: null
};

// --- DOM Elements ---
const startScreen = document.getElementById('start-screen');
const gameInterface = document.getElementById('game-interface');
const endingScreen = document.getElementById('ending-screen');

const interludeScreen = document.getElementById('interlude-screen');
const finalEndingScreen = document.getElementById('final-ending-screen');
const finalEndingImage = document.getElementById('final-ending-image');
const finalEndingTitle = document.getElementById('final-ending-title');
const finalEndingMessage = document.getElementById('final-ending-message');
const exportFinalMemoryButton = document.getElementById('export-final-memory');
const playNewFinalPathButton = document.getElementById('play-new-final-path');
const interludeTitle = document.getElementById('interlude-title');
const interludeMessage = document.getElementById('interlude-message');
const continueFromInterludeButton = document.getElementById('continue-from-interlude');

const gameArea = document.getElementById('game-area');
const choicesContainer = document.getElementById('choices-container');
const inputContainer = document.getElementById('input-container');
const openTextInput = document.getElementById('open-text-input');
const sendOpenTextButton = document.getElementById('send-open-text');
const relationshipValueDisplay = document.getElementById('relationship-value');
const relationshipProgress = document.getElementById('relationship-progress');
const currentSceneTitle = document.getElementById('current-scene-title');
const backButton = document.getElementById('back-button');

const startNewGameButton = document.getElementById('start-new-game');
const loadGameButton = document.getElementById('load-game');
const viewAnswersButton = document.getElementById('view-answers');

const endingTitle = document.getElementById('ending-title');
const endingMessage = document.getElementById('ending-message');
const exportMemoryButton = document.getElementById('export-memory');
const playNewPathButton = document.getElementById('play-new-path');
const exportedDataPre = document.getElementById('exported-data');

const characterDisplay = document.getElementById('character-display');
const memoryModal = document.getElementById('memory-modal');
const closeMemoryModalButton = document.querySelector('#memory-modal .close-button');
const closeMemoryModalButtonBottom = document.getElementById('close-memory-modal');
const memoryDetailsContainer = document.getElementById('memory-details-container');

// กำหนดท่าทางและไฟล์รูปภาพ
const characterPoses = {
    happy: 'images/characters/happy.png',
    sad: 'images/characters/sad.png',
    curious: 'images/characters/curious.png',
    beg: 'images/characters/beg.png',
    walk: 'images/characters/walk.png',
    path1: 'images/character_paths/path1.png',
    flower: 'images/characters/flower.png',
};

// --- Utility Functions ---
function generateUniqueId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
}

function saveState() {
    try {
        localStorage.setItem('moonlightBunnyTrailState', JSON.stringify(gameState));
        console.log('State saved:', gameState); // For debugging
    } catch (e) {
        console.error("Error saving state to localStorage:", e);
    }
}

function loadState() {
    const savedState = localStorage.getItem('moonlightBunnyTrailState');
    if (savedState) {
        try {
            const parsedState = JSON.parse(savedState);
            // Merge with default to ensure new fields are added if game updates
            gameState = {
                ...gameState,
                ...parsedState,
                personality_tags: { ...(gameState.personality_tags || {}), ...(parsedState.personality_tags || {}) },
                profile_answers: { ...(gameState.profile_answers || {}), ...(parsedState.profile_answers || {}) }
            };
            // Ensure history items have player_action_text for back button to work correctly with old saves
            gameState.history = (gameState.history || []).map(entry => {
                if (!entry.player_action_text) {
                    const scene = gameScenes[entry.scene_id];
                    if (scene) {
                        const step = scene.steps.find(s => s.id === entry.step_id);
                        if (step) {
                            if (entry.choice_id) {
                                const choice = step.interaction.choices.find(c => c.id === entry.choice_id);
                                entry.player_action_text = choice ? choice.label : 'ตัวเลือกที่ไม่รู้จัก';
                            } else if (entry.open_answer_text) {
                                entry.player_action_text = entry.open_answer_text;
                            }
                        }
                    }
                }
                return entry;
            });
            console.log('State loaded:', gameState);
            return true;
        } catch (e) {
            console.error("Error parsing saved state:", e);
            localStorage.removeItem('moonlightBunnyTrailState'); // Clear corrupted state
            alert('พบข้อผิดพลาดในการโหลดเกม! เริ่มเกมใหม่');
            return false;
        }
    }
    return false;
}

function resetGame() {
    gameState = {
        userId: generateUniqueId(),
        relationship: 0,
        personality_tags: { gentle: 0, playful: 0, romantic: 0, adventurous: 0, peaceful: 0, creative: 0 },
        profile_answers: { playerName: null, favorite_animal: null, free_time: null, gift_preference: null, self_comfort: null },
        current_scene_id: "scene_001",
        current_step_index: 0,
        history: [],
        current_displayed_chat_bubbles: 0,
        current_character_pose: null
    };
    saveState();
    finalEndingScreen.classList.add('hidden');

}

function updateRelationshipUI() {
    relationshipValueDisplay.textContent = Math.max(0, gameState.relationship); // Ensure it doesn't go below 0
    const progress = Math.min(100, Math.max(0, gameState.relationship)); // Cap at 0-100 for display
    relationshipProgress.style.width = `${progress}%`;
}

function addChatBubble(text, speakerClass = 'npc', delay = 100) {
    return new Promise(resolve => {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${speakerClass}`;
        bubble.innerHTML = text.replace(/\[ชื่อเรา\]/g, gameState.profile_answers.playerName || "คุณ"); // Replace placeholder
        gameArea.appendChild(bubble);
        gameArea.scrollTop = gameArea.scrollHeight;

        setTimeout(() => {
            resolve();
        }, delay); // Small delay to allow for sequential bubble display
    });
}

// <--- ฟังก์ชันใหม่: แสดงท่าทางตัวละคร
async function showCharacterPose(poseKey) {
    if (!characterPoses[poseKey]) {
        console.warn(`Character pose "${poseKey}" not found.`);
        return;
    }

    // ล้างตัวละครเก่าออกก่อน (ถ้ามี)
    characterDisplay.innerHTML = '';

    // สร้างรูปภาพใหม่
    const img = document.createElement('img');
    img.src = characterPoses[poseKey];
    img.alt = `เจลาโต้ - ท่าทาง ${poseKey}`;
    img.classList.add('character-pose-image'); // เพิ่ม class เพื่อให้ CSS กำหนด style ได้

    characterDisplay.appendChild(img);
    gameState.current_character_pose = poseKey; // อัปเดต state

    // ใช้ setTimeout เพื่อให้เบราว์เซอร์มีเวลา render ก่อนเพิ่ม class visible สำหรับ transition
    setTimeout(() => {
        img.classList.add('visible');
    }, 50); // ดีเลย์เล็กน้อย
}

// <--- ฟังก์ชันใหม่: ซ่อนท่าทางตัวละคร
function hideCharacterPose() {
    const currentImg = characterDisplay.querySelector('.character-pose-image');
    if (currentImg) {
        currentImg.classList.remove('visible');
        // รอให้ transition จบก่อนลบออกจาก DOM
        currentImg.addEventListener('transitionend', () => {
            if (currentImg.parentNode) {
                currentImg.parentNode.removeChild(currentImg);
            }
        }, { once: true });
    }
    gameState.current_character_pose = null; // อัปเดต state
}

// ฟังก์ชันสำหรับควบคุมการแสดงปุ่มย้อนกลับ
function updateBackButtonVisibility() {
    if (gameState.history.length > 0) {
        backButton.classList.remove('hidden');
    } else {
        backButton.classList.add('hidden');
    }
}


async function renderCurrentScene() {
    // ซ่อนหน้าจอทั้งหมดก่อน แล้วค่อยแสดงเฉพาะหน้าที่ต้องการ
    startScreen.classList.add('hidden');
    endingScreen.classList.add('hidden');
    nameInputScreen.classList.add('hidden'); // ต้องซ่อนหน้าจอกรอกชื่อด้วย
    gameInterface.classList.remove('hidden');

    const currentScene = gameScenes[gameState.current_scene_id];
    if (!currentScene) {
        console.error("Scene not found:", gameState.current_scene_id);
        showEndingScreen(); // Show generic ending if scene is missing
        return;
    }

    currentSceneTitle.textContent = currentScene.title;
    updateRelationshipUI();
    updateSceneBackground(currentScene.background_image);

    // Clear previous interaction options
    choicesContainer.innerHTML = '';
    choicesContainer.classList.add('hidden');
    inputContainer.classList.add('hidden');
    openTextInput.value = '';

    // Render history up to current step
    gameArea.innerHTML = ''; // Clear chat history to re-render
    gameState.current_displayed_chat_bubbles = 0; // Reset counter for new rendering

    // <--- ซ่อนตัวละครเมื่อเริ่ม render scene ใหม่ เพื่อให้มันโผล่มาพร้อมประโยคแรก
    hideCharacterPose();
    await new Promise(resolve => setTimeout(resolve, 300)); // ให้เวลาซ่อนตัวละคร

    for (let i = 0; i < gameState.history.length; i++) {
        const entry = gameState.history[i];
        const scene = gameScenes[entry.scene_id];
        if (!scene) continue;
        const step = scene.steps.find(s => s.id === entry.step_id);
        if (!step) continue;

        // Only render NPC text once per step history
        if (step.text) {
             await addChatBubble(step.text, 'npc', 0); // Render immediately for history
        }

        // <--- แสดงท่าทางตัวละครจาก history ถ้ามี
             if (step.character_pose) {
                // ถ้าเป็นท่าทางเดิมอยู่แล้ว ก็ไม่ต้องเปลี่ยน
                if (gameState.current_character_pose !== step.character_pose) {
                    await showCharacterPose(step.character_pose);
                }
             }

        // Render player choice/answer
        if (entry.player_action_text) {
            await addChatBubble(entry.player_action_text, 'player', 0); // Render immediately for history
        }
    }

    // Render current step from current_step_index
    const currentStep = currentScene.steps[gameState.current_step_index];
    if (currentStep) {
        if (currentStep.text) {
            await addChatBubble(currentStep.text, 'npc', 500); // Add a small delay for current text
        }

         // <--- แสดงท่าทางตัวละครสำหรับ step ปัจจุบัน
            if (currentStep.character_pose) {
                await showCharacterPose(currentStep.character_pose);
            }

        renderInteraction(currentStep.interaction);
    } else {
        // If no more steps in the current scene, it's the end of the scene
        handleSceneEnd(currentScene.end);
    }
    updateBackButtonVisibility();
}

function renderInteraction(interaction) {
    if (interaction.type === 'choices') {
        choicesContainer.classList.remove('hidden');
        interaction.choices.forEach(choice => {
            const button = document.createElement('button');
            button.textContent = choice.label;
            button.onclick = () => handleChoice(choice);
            choicesContainer.appendChild(button);
        });
    } else if (interaction.type === 'open_text') {
        inputContainer.classList.remove('hidden');
        openTextInput.placeholder = interaction.placeholder || 'พิมพ์คำตอบของคุณที่นี่...';
        sendOpenTextButton.onclick = () => handleOpenAnswer(interaction);
        openTextInput.focus(); // Auto-focus input
    }
    gameArea.scrollTop = gameArea.scrollHeight; // Scroll to bottom
}

async function handleChoice(choice) {
    // Remove interaction options immediately
    choicesContainer.classList.add('hidden');

    // Add player's choice to chat
    await addChatBubble(choice.label, 'player');

    // Apply effects
    gameState.relationship += choice.effects.relationship || 0;
    for (const tag in choice.effects.tags) {
        gameState.personality_tags[tag] = (gameState.personality_tags[tag] || 0) + choice.effects.tags[tag];
    }

    // Save to history
    gameState.history.push({
        scene_id: gameState.current_scene_id,
        step_id: gameScenes[gameState.current_scene_id].steps[gameState.current_step_index].id,
        choice_id: choice.id,
        player_action_text: choice.label, // Store player's actual text for history display
        timestamp: Date.now()
    });

    saveState();
    renderNextStep();
}

async function handleOpenAnswer(interaction) {
    const answerText = openTextInput.value.trim();
    if (!answerText) return;

    // Remove interaction options immediately
    inputContainer.classList.add('hidden');
    openTextInput.value = ''; // Clear input

    // Add player's answer to chat
    await addChatBubble(answerText, 'player');

    // Save answer
    const savePath = interaction.save_as.split('.');
    let currentRef = gameState;
    for (let i = 0; i < savePath.length - 1; i++) {
        if (!currentRef[savePath[i]]) currentRef[savePath[i]] = {};
        currentRef = currentRef[savePath[i]];
    }
    currentRef[savePath[savePath.length - 1]] = answerText;

    // Special handling for player name (if you add an interaction for it)
    if (interaction.save_as === 'profile_answers.playerName') { // Assuming this is the correct path for playerName
        gameState.profile_answers.playerName = answerText;
    }

    // Apply effects based on keywords
    applyEffectsFromOpenAnswer(interaction.effects_map, answerText);

    // Save to history
    gameState.history.push({
        scene_id: gameState.current_scene_id,
        step_id: gameScenes[gameState.current_scene_id].steps[gameState.current_step_index].id,
        open_answer_text: answerText,
        player_action_text: answerText, // Store player's actual text for history display
        timestamp: Date.now()
    });

    saveState();
    renderNextStep();
}

function applyEffectsFromOpenAnswer(effectsMap, text) {
    let appliedKeywordEffect = false;
    if (effectsMap.keywords) {
        for (const keywordEffect of effectsMap.keywords) {
            if (text.toLowerCase().includes(keywordEffect.word.toLowerCase())) {
                gameState.relationship += keywordEffect.effects.relationship || 0;
                for (const tag in keywordEffect.tags) {
                    gameState.personality_tags[tag] = (gameState.personality_tags[tag] || 0) + keywordEffect.tags[tag];
                }
                appliedKeywordEffect = true;
                break;
            }
        }
    }
    if (!appliedKeywordEffect && effectsMap.default) {
        gameState.relationship += effectsMap.default.relationship || 0;
        for (const tag in effectsMap.default.tags) {
            gameState.personality_tags[tag] = (gameState.personality_tags[tag] || 0) + effectsMap.default.tags[tag];
        }
    }
}

async function renderNextStep() {
    gameState.current_step_index++;
    const currentScene = gameScenes[gameState.current_scene_id];

    if (currentScene && gameState.current_step_index < currentScene.steps.length) {
        // Continue with next step in current scene
        renderCurrentScene();
    } else {
        // End of current scene or scene not found (shouldn't happen if scene check is first)
        if (currentScene && currentScene.end) {
            handleSceneEnd(currentScene.end);
        } else {
            console.error("No end configuration for scene:", gameState.current_scene_id);
            showEndingScreen("จบเรื่อง", "ขออภัย เกิดข้อผิดพลาดในฉากจบ.");
        }
    }
    saveState();
    updateBackButtonVisibility();
}
async function handleSceneEnd(endConfig) {
    // Apply end-of-scene effects
    gameState.relationship += endConfig.effects.relationship || 0;
    saveState();
    updateRelationshipUI();


    if (endConfig.next_scene === "final_ending_moon_conquered") {
        const finalEndingSceneData = gameScenes[endConfig.next_scene];
        if (finalEndingSceneData && finalEndingSceneData.type === "full_image_ending") {
            // แทนที่ [relationship] ด้วยค่าจริง
            const formattedMessage = finalEndingSceneData.message.replace(
                /\[relationship\]/g,
                gameState.relationship
            );
            await showFinalEndingScreen(
                finalEndingSceneData.title,
                formattedMessage,
                finalEndingSceneData.image
            );
            return; // จบการทำงานที่นี่ ไม่ต้องโหลดฉากต่อไป
        }
    }

    // ถ้าไม่ใช่ฉากจบแบบ Full Image หรือ next_scene เป็น null
    if (endConfig.next_scene) {
        // ถ้ามี next_scene แต่ไม่ใช่ฉากจบ Full Image ให้แสดง interlude ปกติ
        await showInterludeScreen(
            gameScenes[gameState.current_scene_id].title,
            endConfig.text
        );

        // Transition to the next scene
        gameState.current_scene_id = endConfig.next_scene;
        gameState.current_step_index = 0;
        renderCurrentScene();
    } else {
        // ถ้าไม่มี next_scene เลย (จบแบบ generic)
        await new Promise(resolve => setTimeout(resolve, 2000));
        showGenericEndingScreen(); // แสดงตอนจบแบบ Generic
    }
}
function showEndingScreen(title = "", message = "") {
    startScreen.classList.add('hidden');
    nameInputScreen.classList.add('hidden');
    gameInterface.classList.add('hidden');
    interludeScreen.classList.add('hidden');
    finalEndingScreen.classList.add('hidden'); // ซ่อน finalEndingScreen ด้วย
    memoryModal.classList.add('hidden'); // NEW: ซ่อน modal ความทรงจำ
    endingScreen.classList.remove('hidden');

    const relationship = gameState.relationship;
    let finalTitle = "";
    let finalMessage = "";

    if (title && message) { // If custom title/message provided
        finalTitle = title;
        finalMessage = message;
    } else if (relationship >= 70) {
        finalTitle = "Ending A: แสงจันทร์เคียงคู่";
        finalMessage = `ความสัมพันธ์ของคุณกับเจลาโต้ลึกซึ้งมาก คุณได้พบดวงจันทร์ของเจลาโต้และเดินทางเคียงคู่กันไป... ขอบคุณที่เปิดใจและร่วมทางกันมาตลอดเส้นทางนี้! (ความใกล้ชิด: ${relationship}/100)`;
    } else if (relationship >= 40 && relationship < 70) {
        finalTitle = "Ending B: มิตรภาพใต้แสงจันทร์";
        finalMessage = `คุณและเจลาโต้กลายเป็นเพื่อนที่อบอุ่นต่อกัน ได้เรียนรู้และเติบโตไปด้วยกันบนเส้นทางนี้ (ความใกล้ชิด: ${relationship}/100)`;
    } else {
        finalTitle = "Ending C: เส้นทางที่ยังรอคอย";
        finalMessage = `การเดินทางของคุณกับเจลาโต้ยังไม่สิ้นสุด... เส้นทางข้างหน้ายังรอให้คุณสำรวจและเปิดใจกันอีกครั้ง (ความใกล้ชิด: ${relationship}/100)`;
    }

    endingTitle.textContent = finalTitle;
    endingMessage.textContent = finalMessage;
    exportedDataPre.classList.add('hidden'); // Hide export data by default
}

function showStartScreen() {
    gameInterface.classList.add('hidden');
    endingScreen.classList.add('hidden');
    nameInputScreen.classList.add('hidden');
    interludeScreen.classList.add('hidden');
    finalEndingScreen.classList.add('hidden');
    memoryModal.classList.add('hidden'); // NEW: ซ่อน modal ความทรงจำ
    startScreen.classList.remove('hidden');
}

function showNameInputScreen() {
    startScreen.classList.add('hidden');
    endingScreen.classList.add('hidden');
    gameInterface.classList.add('hidden');
    interludeScreen.classList.add('hidden');
    finalEndingScreen.classList.add('hidden');
    memoryModal.classList.add('hidden'); // NEW: ซ่อน modal ความทรงจำ
    nameInputScreen.classList.remove('hidden');
    playerNameInput.value = gameState.profile_answers.playerName || ''; // ใส่ชื่อเดิมถ้ามี
    playerNameInput.focus();
}

async function back() {
    if (gameState.history.length > 0) {
        // 1. นำ action ล่าสุดออกจาก history
        const lastAction = gameState.history.pop();
        console.log("Undoing last action:", lastAction);

        // 2. หากไม่มีประวัติเหลือแล้ว หรือเป็นการย้อนกลับไปจุดเริ่มต้นจริงๆ
        if (gameState.history.length === 0) {
            // ไปยังฉากแรกสุดและ step แรกสุด
            gameState.current_scene_id = "scene_001";
            gameState.current_step_index = 0;
            // รีเซ็ตค่าความสัมพันธ์และ personality_tags รวมถึงคำตอบโปรไฟล์ทั้งหมด
            gameState.relationship = 0;
            gameState.personality_tags = { gentle: 0, playful: 0, romantic: 0, adventurous: 0, peaceful: 0, creative: 0 };
            gameState.profile_answers = { playerName: null, favorite_animal: null, free_time: null, gift_preference: null, self_comfort: null };
            gameState.current_character_pose = null; // รีเซ็ตท่าทางตัวละคร
            hideCharacterPose(); // ซ่อนตัวละคร
        } else {
            // 3. หาวาระ (entry) ก่อนหน้าใน history เพื่อกำหนด current_scene_id และ current_step_index ใหม่
            const previousEntry = gameState.history[gameState.history.length - 1]; // วาระล่าสุดที่เหลืออยู่
            gameState.current_scene_id = previousEntry.scene_id;
            // ต้องหา step_index ที่ถูกต้องสำหรับ previousEntry ในฉากนั้น
            gameState.current_step_index = gameScenes[previousEntry.scene_id].steps.findIndex(s => s.id === previousEntry.step_id);
            if (gameState.current_step_index === -1) { // กรณีที่ไม่พบ step_id อาจเกิดจากการโหลดเกมเก่า
                console.warn(`Could not find step_id ${previousEntry.step_id} in scene ${previousEntry.scene_id}. Resetting step index.`);
                gameState.current_step_index = 0;
            }


            // 4. คำนวณค่า relationship และ personality_tags ใหม่ทั้งหมดจาก history ที่เหลือ
            // นี่คือส่วนสำคัญที่ทำให้การย้อนกลับถูกต้อง
            gameState.relationship = 0;
            gameState.personality_tags = { gentle: 0, playful: 0, romantic: 0, adventurous: 0, peaceful: 0, creative: 0 };
            // ต้องตั้งค่า profile_answers.playerName ให้ถูกต้อง หากถูกตั้งไว้ก่อนหน้า
            const originalPlayerName = gameState.profile_answers.playerName;
            gameState.profile_answers = { playerName: originalPlayerName, favorite_animal: null, free_time: null, gift_preference: null, self_comfort: null }; // รีเซ็ตคำตอบโปรไฟล์อื่นๆ

            for (const entry of gameState.history) {
                const scene = gameScenes[entry.scene_id];
                if (!scene) continue;
                const step = scene.steps.find(s => s.id === entry.step_id);
                if (!step || !step.interaction) continue;

                if (entry.choice_id) {
                    const choice = step.interaction.choices.find(c => c.id === entry.choice_id);
                    if (choice && choice.effects) {
                        gameState.relationship += choice.effects.relationship || 0;
                        for (const tag in choice.effects.tags) {
                            gameState.personality_tags[tag] = (gameState.personality_tags[tag] || 0) + choice.effects.tags[tag];
                        }
                    }
                } else if (entry.open_answer_text) {
                    // Reapply open text effects and save answers
                    if (step.interaction.save_as) {
                         const savePath = step.interaction.save_as.split('.');
                         let currentRef = gameState;
                         for (let i = 0; i < savePath.length - 1; i++) {
                             if (!currentRef[savePath[i]]) currentRef[savePath[i]] = {};
                             currentRef = currentRef[savePath[i]];
                         }
                         currentRef[savePath[savePath.length - 1]] = entry.open_answer_text;
                    }
                    applyEffectsFromOpenAnswer(step.interaction.effects_map, entry.open_answer_text);
                }
            }
        }

        // 5. บันทึก state ใหม่และ render ฉากปัจจุบัน
        saveState();
        await renderCurrentScene(); // ใช้ await เพื่อให้แน่ใจว่าการ render เสร็จสมบูรณ์ก่อนจะทำอย่างอื่น
    } else {
        // หากไม่มีประวัติเลย ให้กลับไปหน้าจอเริ่มต้น
        showStartScreen();
        // ล้าง state ทั้งหมดเมื่อกลับไปหน้าจอเริ่มต้น
        resetGame();
    }
    updateBackButtonVisibility();
}

function viewAllAnswersForCreator() {
    const allAnswers = localStorage.getItem('moonlightBunnyTrailState'); // Load the raw saved state
    if (allAnswers) {
        try {
            const parsedState = JSON.parse(allAnswers);
            let report = "--- รายงานคำตอบผู้เล่น ---\n";
            report += `User ID: ${parsedState.userId}\n`;
            report += `ความสัมพันธ์: ${parsedState.relationship}\n`;
            report += `Personality Tags: ${JSON.stringify(parsedState.personality_tags, null, 2)}\n`;
            report += `คำตอบ (Profile Answers):\n${JSON.stringify(parsedState.profile_answers, null, 2)}\n`;
            report += `ประวัติการเล่น:\n`;
            parsedState.history.forEach(entry => {
                const date = new Date(entry.timestamp).toLocaleString('th-TH');
                report += `  - [${date}] Scene: ${entry.scene_id}, Step: ${entry.step_id}`;
                if (entry.choice_id) report += `, Choice: ${entry.choice_id} (${entry.player_action_text})`;
                if (entry.open_answer_text) report += `, Answer: "${entry.open_answer_text}"`;
                report += `\n`;
            });

            // Display this report in an alert or a new window/modal
            alert(report);
            console.log(report); // Also log to console for easy copy-paste
        } catch (e) {
            console.error("Error viewing answers:", e);
            alert("ไม่สามารถแสดงคำตอบได้: ข้อมูลเสียหายหรือไม่มีข้อมูล.");
        }
    } else {
        alert("ยังไม่มีข้อมูลผู้เล่น.");
    }
}

// NEW: ฟังก์ชันสำหรับแสดงหน้าจอคั่น
async function showInterludeScreen(title, message) {
    // ซ่อนหน้าจออื่นๆ ทั้งหมด
    startScreen.classList.add('hidden');
    nameInputScreen.classList.add('hidden');
    gameInterface.classList.add('hidden');
    endingScreen.classList.add('hidden');
    hideCharacterPose(); // ซ่อนตัวละคร

    interludeTitle.textContent = title;
    interludeMessage.textContent = message;
    interludeScreen.classList.remove('hidden'); // ทำให้มองเห็นได้
    interludeScreen.classList.add('visible'); // เริ่ม transition fade-in
    continueFromInterludeButton.classList.add('hidden'); // ซ่อนปุ่มก่อน

    // รอสักครู่ให้ข้อความแสดงขึ้นมา
    await new Promise(resolve => setTimeout(resolve, 3000)); // รอ 3 วินาที

    // แสดงปุ่ม "เดินทางต่อ"
    continueFromInterludeButton.classList.remove('hidden');

    // รอให้ผู้เล่นกดปุ่ม "เดินทางต่อ"
    return new Promise(resolve => {
        const handleClick = () => {
            continueFromInterludeButton.removeEventListener('click', handleClick);
            resolve();
        };
        continueFromInterludeButton.addEventListener('click', handleClick);
    });
}

// NEW: ฟังก์ชันสำหรับซ่อนหน้าจอคั่น
function hideInterludeScreen() {
    interludeScreen.classList.remove('visible'); // เริ่ม transition fade-out
    interludeScreen.addEventListener('transitionend', function handler() {
        interludeScreen.classList.add('hidden'); // ซ่อนจริงๆ เมื่อ transition จบ
        interludeScreen.removeEventListener('transitionend', handler);
    }, { once: true });
}
// NEW: ฟังก์ชันสำหรับแสดงตอนจบแบบ Full Image
async function showFinalEndingScreen(title, message, imageUrl) {
    // ซ่อนหน้าจออื่นๆ ทั้งหมด
    startScreen.classList.add('hidden');
    nameInputScreen.classList.add('hidden');
    gameInterface.classList.add('hidden');
    interludeScreen.classList.add('hidden');
    endingScreen.classList.add('hidden'); // ซ่อน endingScreen เก่าด้วย
    hideCharacterPose();

    finalEndingImage.src = imageUrl;
    finalEndingTitle.textContent = title;
    finalEndingMessage.textContent = message;

    finalEndingScreen.classList.remove('hidden');
    await new Promise(resolve => setTimeout(resolve, 50)); // ให้เวลา DOM อัปเดตก่อนเริ่ม transition
    finalEndingScreen.classList.add('visible');

    // อัปเดต Event Listeners สำหรับปุ่มใน final ending
    exportFinalMemoryButton.addEventListener('click', () => { // ใช้ addEventListener
        const dataToExport = {
            relationship: gameState.relationship,
            personality_tags: gameState.personality_tags,
            profile_answers: gameState.profile_answers,
            history: gameState.history
        };
        // แสดงใน alert หรือจะสร้าง modal ขึ้นมาก็ได้
        alert("--- เซฟความทรงจำ ---\n" + JSON.stringify(dataToExport, null, 2));
    });

    playNewFinalPathButton.onclick = () => {
        resetGame();
        showStartScreen(); // กลับไปหน้าจอเริ่มต้น
    };
}

function showGenericEndingScreen(title = "", message = "") {
    startScreen.classList.add('hidden');
    nameInputScreen.classList.add('hidden');
    gameInterface.classList.add('hidden');
    interludeScreen.classList.add('hidden');
    finalEndingScreen.classList.add('hidden'); // ซ่อน finalEndingScreen ด้วย
    memoryModal.classList.add('hidden'); // NEW: ซ่อน modal ความทรงจำ
    endingScreen.classList.remove('hidden');

    const relationship = gameState.relationship;
    let finalTitle = "";
    let finalMessage = "";

    if (title && message) { // If custom title/message provided
        finalTitle = title;
        finalMessage = message;
    } else if (relationship >= 70) {
        finalTitle = "Ending A: แสงจันทร์เคียงคู่";
        finalMessage = `ความสัมพันธ์ของคุณกับเจลาโต้ลึกซึ้งมาก คุณได้พบดวงจันทร์ของเจลาโต้และเดินทางเคียงคู่กันไป... ขอบคุณที่เปิดใจและร่วมทางกันมาตลอดเส้นทางนี้! (ความใกล้ชิด: ${relationship}/100)`;
    } else if (relationship >= 40 && relationship < 70) {
        finalTitle = "Ending B: มิตรภาพใต้แสงจันทร์";
        finalMessage = `คุณและเจลาโต้กลายเป็นเพื่อนที่อบอุ่นต่อกัน ได้เรียนรู้และเติบโตไปด้วยกันบนเส้นทางนี้ (ความใกล้ชิด: ${relationship}/100)`;
    } else {
        finalTitle = "Ending C: เส้นทางที่ยังรอคอย";
        finalMessage = `การเดินทางของคุณกับเจลาโต้ยังไม่สิ้นสุด... เส้นทางข้างหน้ายังรอให้คุณสำรวจและเปิดใจกันอีกครั้ง (ความใกล้ชิด: ${relationship}/100)`;
    }

    endingTitle.textContent = finalTitle;
    endingMessage.textContent = finalMessage;
    exportedDataPre.classList.add('hidden'); // Hide export data by default
}

// NEW: ฟังก์ชันสำหรับแสดง Memory Modal
function showMemoryModal() {
    memoryDetailsContainer.innerHTML = ''; // Clear previous content

    const playerName = gameState.profile_answers.playerName || "ผู้เล่น";

    // 1. Player Name
    const nameBlock = document.createElement('div');
    nameBlock.classList.add('memory-block');
    nameBlock.innerHTML = `<strong>ชื่อ:</strong> ${playerName}`;
    memoryDetailsContainer.appendChild(nameBlock);

    // 2. Relationship
    const relationshipBlock = document.createElement('div');
    relationshipBlock.classList.add('memory-block');
    relationshipBlock.innerHTML = `<strong>ความใกล้ชิดกับบันนี่:</strong> ${gameState.relationship}/100`;
    memoryDetailsContainer.appendChild(relationshipBlock);

    // 3. Personality Tags
    const tagsBlock = document.createElement('div');
    tagsBlock.classList.add('memory-block');
    let tagsHtml = `<strong>บุคลิก:</strong><br>`;
    for (const tag in gameState.personality_tags) {
        if (gameState.personality_tags[tag] > 0) {
            tagsHtml += `- ${tag}: ${gameState.personality_tags[tag]}<br>`;
        }
    }
    if (Object.keys(gameState.personality_tags).every(tag => gameState.personality_tags[tag] === 0)) {
        tagsHtml += "ยังไม่มีข้อมูลบุคลิก";
    }
    tagsBlock.innerHTML = tagsHtml;
    memoryDetailsContainer.appendChild(tagsBlock);

    // 4. Player's Specific Answers (e.g., free_time, favorite_animal)
    const answersBlock = document.createElement('div');
    answersBlock.classList.add('memory-block');
    let answersHtml = `<strong>คำตอบของคุณ:</strong><br>`;
    if (gameState.profile_answers.free_time) {
        answersHtml += `- สิ่งที่ทำยามว่าง: "${gameState.profile_answers.free_time}"<br>`;
    }
    if (gameState.profile_answers.favorite_animal) {
         answersHtml += `- สัตว์ที่อยากเป็น: "${gameState.profile_answers.favorite_animal}"<br>`;
    }
    if (answersHtml === `<strong>คำตอบของคุณ:</strong><br>`) {
        answersHtml += "ยังไม่มีคำตอบพิเศษ";
    }
    answersBlock.innerHTML = answersHtml;
    memoryDetailsContainer.appendChild(answersBlock);


    // 5. History of interactions
    const historyTitle = document.createElement('div');
    historyTitle.classList.add('memory-block');
    historyTitle.innerHTML = `<strong>ประวัติการเดินทาง:</strong>`;
    memoryDetailsContainer.appendChild(historyTitle);

    gameState.history.forEach(entry => {
        const historyBlock = document.createElement('div');
        historyBlock.classList.add('memory-block');
        const date = new Date(entry.timestamp).toLocaleString('th-TH');
        const scene = gameScenes[entry.scene_id] ? gameScenes[entry.scene_id].title : entry.scene_id;
        const step = gameScenes[entry.scene_id] && gameScenes[entry.scene_id].steps.find(s => s.id === entry.step_id) ?
                     gameScenes[entry.scene_id].steps.find(s => s.id === entry.step_id).text : "ข้อความบันนี่";


        let entryHtml = `<em>[${date}] ฉาก ${scene}</em><br>`;

        // แสดงคำพูดของ NPC ที่นำไปสู่การตอบ (ถ้ามี)
        if (step && typeof step === 'string') { // ตรวจสอบว่าเป็น string
            entryHtml += `<span style="color: #6a6a6a;">บันนี่พูด: "${step.substring(0, 50)}..."</span><br>`; // แสดงบางส่วน
        } else if (step && typeof step === 'object' && step.text) { // ถ้า step เป็น object และมี .text
             entryHtml += `<span style="color: #6a6a6a;">บันนี่พูด: "${step.text.substring(0, 50)}..."</span><br>`; // แสดงบางส่วน
        }


        // แสดงคำตอบของผู้เล่น
        if (entry.player_action_text) {
            historyBlock.classList.add('player-response'); // เพิ่ม class เพื่อให้มีสไตล์ต่างออกไป
            entryHtml += `<strong>คุณตอบ:</strong> "${entry.player_action_text.replace(/\[ชื่อเรา\]/g, playerName)}"<br>`;
        }
        historyBlock.innerHTML = entryHtml;
        memoryDetailsContainer.appendChild(historyBlock);
    });


    memoryModal.classList.remove('hidden');
    memoryModal.classList.add('visible');
}

// NEW: ฟังก์ชันสำหรับซ่อน Memory Modal
function hideMemoryModal() {
    memoryModal.classList.remove('visible');
    memoryModal.addEventListener('transitionend', function handler() {
        memoryModal.classList.add('hidden');
        memoryModal.removeEventListener('transitionend', handler);
    }, { once: true });
}

function updateSceneBackground(imageUrl) {
    if (imageUrl) {
        sceneBackground.style.backgroundImage = `url('${imageUrl}')`;
        sceneBackground.classList.add('visible');
    } else {
        sceneBackground.classList.remove('visible');
        sceneBackground.style.backgroundImage = 'none';
    }
}

// --- Event Listeners ---
startNewGameButton.addEventListener('click', () => {
    resetGame();
    showNameInputScreen();
});

loadGameButton.addEventListener('click', () => {
    if (loadState()) {
     if (gameState.profile_answers.playerName) {    
        // ไม่ต้องแสดง showNameInputScreen อีก ถ้ามีชื่อแล้ว ให้เริ่มเกมต่อเลย
        renderCurrentScene(); 
     } else {
        showNameInputScreen(); // ถ้าไม่มีชื่อ ให้ไปกรอกชื่อ
     }
    } else {
        alert("ไม่มีเกมที่บันทึกไว้! กรุณาเริ่มเกมใหม่");
        resetGame(); // Start new game if no save
        showNameInputScreen();
    }
});

confirmNameButton.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    if (name) {
        gameState.profile_answers.playerName = name;
        saveState();
        renderCurrentScene(); // เมื่อกรอกชื่อเสร็จแล้ว ก็เริ่ม render ฉากแรก
    } else {
        alert("กรุณาป้อนชื่อของคุณ!");
        playerNameInput.focus();
    }
});

viewAnswersButton.addEventListener('click', viewAllAnswersForCreator);

backButton.addEventListener('click', back);

// แก้ไข: ปุ่ม "เซฟความทรงจำ" ใน Ending Screen ปกติ
exportMemoryButton.addEventListener('click', () => {
    showMemoryModal(); // แสดง modal แทนการแสดงใน <pre>
});

playNewPathButton.addEventListener('click', () => {
    resetGame();
    renderCurrentScene();
});

continueFromInterludeButton.addEventListener('click', hideInterludeScreen);

// แก้ไข: ปุ่ม "เซฟความทรงจำ" ใน Final Ending Screen
exportFinalMemoryButton.addEventListener('click', () => {
    showMemoryModal(); // แสดง modal แทน alert
});

playNewFinalPathButton.addEventListener('click', () => {
    resetGame();
    showStartScreen(); // กลับไปหน้าจอเริ่มต้น
});

// NEW: Event Listeners สำหรับ Memory Modal
closeMemoryModalButton.addEventListener('click', hideMemoryModal);
closeMemoryModalButtonBottom.addEventListener('click', hideMemoryModal);
window.addEventListener('click', (event) => {
    if (event.target == memoryModal) {
        hideMemoryModal();
    }
});
// Initial setup on page load
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('moonlightBunnyTrailState')) {
        loadGameButton.textContent = "เล่นต่อจากที่ค้าง";
        loadGameButton.disabled = false;
        loadGameButton.style.opacity = 1;
    } else {
        loadGameButton.textContent = "ไม่มีเกมที่ค้าง (เริ่มใหม่)";
        loadGameButton.disabled = true;
        loadGameButton.style.opacity = 0.6;
    }
    showStartScreen();

});