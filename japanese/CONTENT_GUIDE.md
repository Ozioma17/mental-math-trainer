# Kotoba Garden content guide

Live path: https://ozioma17.github.io/mental-math-trainer/japanese/
Repository: Ozioma17/mental-math-trainer, main branch. GitHub Pages publishes from the root. The existing maths trainers and their storage keys must be preserved.

## Updating learning material

Read the latest `japanese/content.json` and this guide before writing. Append to that catalog, preserve every existing ID, and update revision and updatedAt. The client fetches content.json at launch and through its refresh button. No app code or embedded starter changes are necessary for ordinary content additions. Do not overwrite browser progress, reorder answer indices without updating answers, or publish user images, private messages, personally identifying material, or browser backups. The repository is public.

When a user sends a picture/page, extract its vocabulary and grammar in chat; verify uncertain readings before publishing. Prefer the dictionary lemma (dictionary verb form); explain special contextual senses and any irregular inflections. Deduplicate by lemma, reading and sense; retain both source references if an entry occurs in multiple collections. Create source records with concise provenance; use original stories rather than reproducing copyrighted source passages. A word's kanji breakdown describes the characters themselves, separately from the vocabulary meaning. Sound-image suggestions can be arbitrary visible objects/actions and need not relate to meaning. Never require remembering an invented person's name.

A reading must list **every substantive vocabulary item** and target grammar construction needed to read it. Include unknown items as prerequisites rather than claiming the learner knows them. Basic particles, pronouns, polite/past forms and stated foundation constructions can be assumed; expand the foundation explanation or add a new grammar entry if a new construction exceeds it. New content must not silently redefine the existing foundation. Add an accurate English translation under each Japanese paragraph. Use varied realistic contexts; rotate campus, travel, friendships, home, experiments, work and reflections. Include original narrative stories, dialogues and short essays; vary plot, purpose and vocabulary combinations. Daily reading additions should reuse existing catalog words and grammar, avoiding an ever-growing prerequisite burden.

## Content schema (version 1)

Top level: `{schemaVersion:1, revision:"unique string", updatedAt:"YYYY-MM-DD", foundation:"assumptions", sources:[], words:[], grammar:[], stories:[]}`.

IDs are unique per array, stable, and use ASCII letters/numbers/hyphens/underscores (maximum 100 chars). Do not use reserved prototype names. JSON is UTF-8.

Source: `{id,title,type,note}`. Source references are stored in `sourceId`; additional provenance can be in `sourceIds`.

Word: `{id,surface,reading,meaning,tags:[],icon,scene,sourceId,kanji:[{char,meaning,reading}],forms:{"inflected surface":"kana reading"}}`. `surface`, `reading` and `meaning` are required strings. Use meaningful, accurate English sense descriptions. `scene` is a vivid image formation prompt. Users add their own sound mnemonics and personal images locally. `forms` supports furigana on tagged inflected forms. Never mark new entries as mastered.

Grammar: `{id,title,meaning,form,explanation,example,translation,questions:[...]}`. At least two distinct questions with plausible unambiguous distractors; avoid mechanical duplicates. Add additional examples/questions to existing points when useful, keeping IDs. Focus each drill on one structure.

Question: `{prompt,options:["A","B","C"],answer:0,explanation}`. `answer` is a zero-based integer pointing to exactly one correct option. At least two unique options (normally 3 or 4). Explain why the correct answer fits. Comprehension questions test events, motives, sequence, inference and meaning, not just memorized vocabulary.

Story: `{id,title,subtitle,context,icon,scene,kind,sourceId,createdAt,wordIds:[],grammarIds:[],paragraphs:[{jp,en}],questions:[...]}`.
Tag **every substantive occurrence** in Japanese: `[[word-id|surface as used]]`, for example `[[go|行きました]]`. Tags create dictionary links. The corresponding ID must be in wordIds and words. Add accurate `forms` readings for each inflected surface. Everything outside tags is plain text; HTML is not interpreted. Titles should use known vocabulary, kana, or include their reading in the subtitle.

The reader unlocks only when all listed words have at least two correct meaning checks and two correct reading checks, and each listed grammar point has two correct checks. A wrong answer resets that skill's success count and returns the word to learning. “Mastered” means an in-app recognition milestone, not proof of speaking fluency. Spaced reviews return after 1, 3, 7, 14 and 30 days. Reading comprehension passes at 80% on a **full** quiz, not a partial retry.

## Safe publication

Validate JSON, unique IDs, all references, tagged words and translations. Confirm all answers and indices. Check Japanese syntax and naturalness. Fetch current branch head, use its tree as base, create an additive commit, and update main without force and with expected head SHA. If the branch moves, re-read and merge changes before retrying. Do not replace the entire repository tree. Confirm the Pages deployment workflow concludes successfully; report blockers honestly.

Personal learning profiles may be provided in chat. Use their masteredWords/masteredGrammar to tailor a reading if present. Daily unattended runs cannot read localStorage; reuse catalog vocabulary, set explicit gates, and never imply live progress synchronization. No AI API keys or GitHub credentials belong in the browser. Extraction and generation happen through the connected assistant; the static website itself does neither.

## Imported learning history

The four original Give meanings sets contain 32, 32, 36 and 36 entries. They are represented by source records learned-set-1 through learned-set-4. Duplicate words share one dictionary entry and list all collections in sourceIds. Each source's entries retains its exact sourceForm and reading, including inflected forms. Previously learned words carry previouslyLearned:true and learnedSets. Dictionary lemmas are used for practice; the original form is also in forms. The import is a record of the user's reported study history and does not automatically grant browser-tested mastery or change existing progress. Preserve these flags, source entries, synonyms and IDs when adding new content.
