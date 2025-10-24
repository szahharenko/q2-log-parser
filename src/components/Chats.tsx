import { useState } from "react";
import { getLanguage } from "../utils/getLanguage";

interface ChatsProps {
    nonGameEvents: string[];
}

export const Chats = ({nonGameEvents}: ChatsProps) => {
    const [chatHidden, setChatHidden] = useState(true);
    const lang = getLanguage();
    if (!nonGameEvents || nonGameEvents.length === 0) return null;
    return <>
      <div className='page' style={{ margin: '30px 0' }}>
          { lang === 'en' ?
            <h3>In-game Chats 💬</h3>
            :
            <h3>Внутри-игровые игры 💬</h3>
          }
        { chatHidden ?
          <button onClick={() => setChatHidden(false)}>
            { lang === 'en' ? 'Show Chats' : 'Показать чаты'}
          </button>
          :
          <pre>
              { nonGameEvents && nonGameEvents.length > 0 && nonGameEvents.map((line, index) => {
                if (
                  line.includes('Timelimit hit.') ||
                  line.includes('Fraglimit hit.')
                ) {
                  return <hr/>
                }
                return <div key={index}>{line}</div>

              })}
          </pre>
      }
      </div>
    </>
}