import { useState } from "react";

interface ChatsProps {
    nonGameEvents: string[];
}

export const Chats = ({nonGameEvents}: ChatsProps) => {
    const [chatHidden, setChatHidden] = useState(true);
    if (!nonGameEvents || nonGameEvents.length === 0) return null;
    return <>
      <div className='page' style={{ margin: '30px 0' }}>
        <h3>In-game Chats 💬</h3>
        { chatHidden ?
          <button onClick={() => setChatHidden(false)}>Show Chats</button>
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