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

export default function SmartBar({
  setDoneItems,
  setTodoItems,
  todoItems,
  doneItems,
}: SmartBarProps) {
  const [error, setError] = useState(false);
  const [value, setValue] = useState('');

  const AI_PROMPT = `
    Contexte : 
    Tu es une SmartBar d'une Todo list et tu dois pouvoir exécuter des actions :
    voici ma todoItems:
    ${todoItems}
    voici ma doneItems:
    ${doneItems}
    Conditions:
    Il ne doit pas y avoir de duplication (pas deux fois la même tâche). Si l'utilisateur le demande, ignore simplement sa requête.
    Je souhaite uniquement que tu me renvoies un JSON des deux tableaux actualisés sans explication, peu importe la demande.
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

  const handleSend = async () => {
    if (value === '') return;
    const result = await smartBarAI(value);
    if (result) {
      const newTabs = JSON.parse(result);
      setTodoItems(newTabs?.todoItems);
      setDoneItems(newTabs?.doneItems);
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
