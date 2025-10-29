import { getLanguage } from "../utils/getLanguage";
import { getPlayer } from "../utils/getPlayer";

interface WeaponsProps {
  weaponStats: Record<string, number> | null;
}
export const Weapons = ({weaponStats}: WeaponsProps) => {
    const lang = getLanguage();
    const activePlayer = getPlayer();
    if (activePlayer) return null;
    return <>
      {weaponStats && (
        <div className='page' style={{ margin: '30px 0' }}>
            { lang === 'en' ?
                <h3>Combined weapon Usage Statistics 🔫 ({Object.values(weaponStats).reduce((a, b) => a + b, 0)})</h3> :
                <h3>Общая статистика использования оружия 🔫 ({Object.values(weaponStats).reduce((a, b) => a + b, 0)})</h3>
            }
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
                {Object.entries(weaponStats)
                    .sort(([, a], [, b]) => b - a)
                    .map(([weapon, count]) => (
                        <li key={weapon}>
                            <strong>{weapon}</strong>: {count} {count > 1 ? 'kills' : 'kill'}
                        </li>
                    ))}
            </ul>
        </div>
      )}
    </>
}