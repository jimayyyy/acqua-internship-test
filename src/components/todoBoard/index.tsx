'use client';

import { useDragAndDrop } from '@formkit/drag-and-drop/react';
import SmartBar from '@/components/smartBar';
import useStore from '../items/store';
import { useEffect } from 'react';
import dynamic from 'next/dynamic';

const NoSSRTodoBoard = () => {
  const TODO_ITEMS = useStore((state) => state.TODO_ITEMS);
  const DONE_ITEMS = useStore((state) => state.DONE_ITEMS);
  const moveItem = useStore((state) => state.moveItem);

  const [todoList, todoItems, setTodoItems] = useDragAndDrop<
    HTMLUListElement,
    string
  >(TODO_ITEMS, {
    group: 'todoList',
  });
  const [doneList, doneItems, setDoneItems] = useDragAndDrop<
    HTMLUListElement,
    string
  >(DONE_ITEMS, {
    group: 'todoList',
  });

  useEffect(() => {
    moveItem(todoItems, doneItems);
  }, [doneItems, todoItems, moveItem]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-acqua-soft-white">
      <h1 className="text-3xl font-bold text-acqua-deep-blue my-6">
        Acqua Board
      </h1>
      <SmartBar
        todoItems={todoItems}
        doneItems={doneItems}
        setTodoItems={setTodoItems}
        setDoneItems={setDoneItems}
      />
      <div className="flex justify-center items-start gap-8 p-5">
        <ul
          ref={todoList}
          className="bg-acqua-yellow rounded-lg p-4 shadow-md w-80 h-96"
        >
          {todoItems.map((item: string) => (
            <li className="p-2 bg-white rounded-lg shadow mb-2" key={item}>
              {item}
            </li>
          ))}
        </ul>
        <ul
          ref={doneList}
          className="bg-acqua-darker-blue rounded-lg p-4 shadow-md w-80 text-white h-96"
        >
          {doneItems?.map((item: string) => (
            <li
              className="p-2 rounded-lg line-through decoration-acqua-retro-yellow decoration-2 shadow mb-2"
              key={item}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const TodoBoard = dynamic(() => Promise.resolve(NoSSRTodoBoard), {
  ssr: false,
});

export default TodoBoard;

// export default function TodoBoard () {
//   const TODO_ITEMS = useStore((state: any) => state.TODO_ITEMS)
//   const DONE_ITEMS = useStore((state: any) => state.DONE_ITEMS)
//   const moveItem = useStore((state) => state.moveItem);
//   const addTodoItem = useStore((state) => state.addTodoItem);

//   const handleDrag = () : void => {
//     console.log(todoItems)
//     console.log(doneItems)
//     moveItem(todoItems, doneItems)
//   }

//   const [todoList, todoItems, setTodoItems] = useDragAndDrop<HTMLUListElement,string>(
//     TODO_ITEMS,
//     {
//       group: 'todoList',
//       handleEnd: handleDrag,
//     },
//   );
//   const [doneList, doneItems, setDoneItems] = useDragAndDrop<HTMLUListElement,string>(
//     DONE_ITEMS,
//     {
//       group: 'todoList',
//       handleEnd: handleDrag,
//     }
//   );

//   return (
//     <div className="flex flex-col justify-center items-center min-h-screen bg-acqua-soft-white">
//       <h1 className="text-3xl font-bold text-acqua-deep-blue my-6">
//         Acqua Board
//       </h1>
//       {/* <SmartBar
//         todoItems={todoItems}
//         doneItems={doneItems}
//         setTodoItems={setTodoItems}
//         setDoneItems={setDoneItems}
//       /> */}
//       <div className="flex justify-center items-start gap-8 p-5">
//           <ul ref={todoList} className="bg-acqua-yellow rounded-lg p-4 shadow-md w-80 h-96">
//             {todoItems.map((item: string, index: number) => (
//                 <li className="p-2 bg-white rounded-lg shadow mb-2" key={index}>
//                   {item}
//                 </li>
//             ))}
//           </ul>
//           <ul ref={doneList} className="bg-acqua-darker-blue rounded-lg p-4 shadow-md w-80 text-white h-96">
//             {doneItems?.map((item: string, index: number) => (
//               <li
//                 className="p-2 rounded-lg line-through decoration-acqua-retro-yellow decoration-2 shadow mb-2"
//                 key={index}
//               >
//                 {item}
//               </li>
//             ))}
//           </ul>
//       </div>
//     </div>
//   );
// }
