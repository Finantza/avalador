// Simple verification script to check database freshness and procedural question generation
(function() {
    const db = window.OnyxDatabase;
    if (!db) {
        console.error("FAIL: OnyxDatabase not loaded");
        return;
    }
    
    // Check subject sizes and uniqueness
    const subjects = ['python', 'portugues', 'geografia', 'biologia', 'matematica'];
    subjects.forEach(sub => {
        const pool1 = db.getFreshPool(sub, 'easy');
        const pool2 = db.getFreshPool(sub, 'easy');
        
        console.log(`[VERIFY] Subject: ${sub}`);
        console.log(`  - Pool 1 length: ${pool1.length}`);
        console.log(`  - Pool 2 length: ${pool2.length}`);
        
        // Count duplicate questions between two runs
        const p1Texts = pool1.map(q => q.q);
        const p2Texts = pool2.map(q => q.q);
        
        const identical = p1Texts.filter(q => p2Texts.includes(q));
        console.log(`  - Identical questions between runs: ${identical.length} / ${pool1.length}`);
    });
})();
