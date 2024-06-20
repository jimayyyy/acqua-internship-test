import { Dispatch, SetStateAction, useState } from 'react';
import { MdOutlineWaterDrop } from 'react-icons/md';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPEN_AI_API_KEY,
  dangerouslyAllowBrowser: true,
});

interface SmartBarProps {
  setTodoItems: Dispatch<SetStateAction<string[]>>;
  setDoneItems: Dispatch<SetStateAction<string[]>>;
  todoItems: string[];
  doneItems: string[];
}

interface FunctionHashMapType {
  [key: string]: (list: string, name: string | 'ALL') => void;
}

interface ListItem {
  set: Dispatch<SetStateAction<string[]>>;
  list: string[];
}

interface HashListItemsType {
  [key: string]: ListItem;
}

export default function SmartBar({
  setDoneItems,
  setTodoItems,
  todoItems,
  doneItems,
}: SmartBarProps) {
  const [error, setError] = useState(false);
  const [value, setValue] = useState('');

  const hashListItems: HashListItemsType = {
    doneItems: {
      set: setDoneItems,
      list: doneItems,
    },
    todoItems: {
      set: setTodoItems,
      list: todoItems,
    },
  };

  const AI_PROMPT = `
    Contexte : Tu es une smartbar et tu dois pouvoir réaliser certaines actions :

    Ajouter une carte à faire dans une catégorie (todoItems ou doneItems)
    Supprimer une carte d'une catégorie (todoItems ou doneItems)
    Déplacer une carte d'une catégorie (depuis todoItems ou doneItems)
    Déplacer toutes les cartes d'une liste (depuis todoItems ou doneItems)
    Renommer une carte
    Voici la liste des todoItems :
    ${todoItems}
    Voici la liste des doneItems :
    ${doneItems}

    Voici la liste des instructions : ADD, DELETE, MOVE, MOVEALL, RENAME, SORT

    Pour DELETE, ADD, MOVE, je voudrais : INSTRUCTION LIST NOM_DE_TACHE
    Sachant que INSTRUCTION vaut une instruction, LIST vaut la liste depuis laquelle il faut ajouter, supprimer ou déplacer, NOM_DE_TACHE vaut le nom de la carte à créer/supprimer/déplacer.

    Pour RENAME, je voudrais : RENAME ANCIEN_NOM NOUVEAU_NOM

    Pour MOVEALL, je voudrais : INSTRUCTION LIST
    Sachant que INSTRUCTION vaut une instruction et LIST vaut une liste depuis laquelle il faut exécuter l'instruction.

    Je voudrais aussi que les noms contenant des espaces soient remplacés par des "_" et que tu répondes seulement par la ligne parsable sans guillemets simples ou doubles.
    `;
  const smartBarAI = async (userPrompt: string) => {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: AI_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      model: 'gpt-3.5-turbo',
      response_format: { type: 'text' },
    });
    return completion.choices[0].message.content;
  };

  const Add = (list: string, name: string) => {
    if (
      todoItems.includes(name) === true ||
      doneItems.includes(name) === true
    ) {
      setError(true);
      return;
    }
    hashListItems[list].set((prev) => [...prev, name]);
  };

  const Delete = (list: string, name: string) => {
    if (!hashListItems[list].list.includes(name)) {
      setError(true);
      return;
    }
    hashListItems[list].set((prev) => prev.filter((item) => item !== name));
  };

  const Move = (list: string, name: string) => {
    const otherList = list === 'todoItems' ? 'doneItems' : 'todoItems';
    if (!hashListItems[otherList].list.includes(name)) {
      setError(true);
      return;
    }
    hashListItems[otherList].set((prev) =>
      prev.filter((item) => item !== name),
    );
    hashListItems[list].set((prev) => [...prev, name]);
  };

  const MoveAll = (list: string) => {
    const otherList = list === 'todoItems' ? 'doneItems' : 'todoItems';

    hashListItems[list].set((prev) =>
      prev.concat(hashListItems[otherList].list),
    );
    hashListItems[otherList].set([]);
  };

  const Rename = (name: string, replaceName: string) => {
    if (
      hashListItems['doneItems'].list.includes(replaceName) ||
      hashListItems['todoItems'].list.includes(replaceName)
    ) {
      setError(true);
      return;
    }
    const listToRename = hashListItems['doneItems'].list.includes(name)
      ? 'doneItems'
      : 'todoItems';

    const index = hashListItems[listToRename].list.indexOf(name);

    if (index === -1 || !replaceName) {
      setError(true);
      return;
    } else {
      hashListItems[listToRename].list[index] = replaceName;
      hashListItems[listToRename] = {
        ...hashListItems[listToRename],
        list: [...hashListItems[listToRename].list],
      };
      hashListItems[listToRename].set(hashListItems[listToRename].list);
    }
  };

  const functionHashMap: FunctionHashMapType = {
    ADD: Add,
    DELETE: Delete,
    MOVE: Move,
    MOVEALL: MoveAll,
    RENAME: Rename,
  };

  const handleSend = async () => {
    if (value === '') return;
    const result = await smartBarAI(value);
    // const result = value;
    const instruction = result?.split(' ');
    if (
      instruction &&
      Object.prototype.hasOwnProperty.call(functionHashMap, instruction[0])
    ) {
      functionHashMap[instruction[0]](
        instruction[1]?.replaceAll('_', ' '),
        instruction[2]?.replaceAll('_', ' '),
      );
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-acqua-soft-white">
      <input
        type="text"
        value={value}
        onChange={(event) => {
          setError(false);
          setValue(event.target.value);
        }}
        placeholder="Type something..."
        className={`flex-1 p-2 text-base border rounded-lg border-gray-300 ${
          error ? 'border-red-500' : ''
        }`}
      />
      <button
        onClick={handleSend}
        className="bg-acqua-deep-blue hover:bg-acqua-darker-blue text-white p-2 rounded-lg cursor-pointer transition duration-300 ease-in-out"
        title="Send"
      >
        <MdOutlineWaterDrop className="text-xl" />
      </button>
    </div>
  );
}
