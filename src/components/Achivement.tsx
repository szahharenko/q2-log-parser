import { type Achievement, HeadHunterAchievement } from '../types/types';
import { getLanguage } from "../utils/getLanguage";
import { getPlayer } from '../utils/getPlayer';

interface AchievementProps {
    image: string;
    title: string;
    achievement: Achievement | HeadHunterAchievement | null
    text: {
        en: React.ReactNode
        ru: React.ReactNode
    }
    cssClass?: string
}

const AchievementItem = ({ image, title, achievement, text, cssClass } : AchievementProps) => {
    const lang = getLanguage();
    const player = getPlayer();
    const hasPlayer = player && ((achievement && 'achievers' in achievement && achievement.achievers.includes(player)) || achievement && 'hunter' in achievement && achievement.hunter === player);
    if (player && !hasPlayer) {
        return null;
    }
    return <div className={'achievement ' + cssClass }>
    <div className='icon'><img src={ image } alt='tet'/></div>
    <div>
      <h3>{title}</h3>
      { achievement ?
        lang === 'en' ? <p>{text.en}</p> : <p>{text.ru}</p>
        :
        <p>TBA</p>
      }
    </div>
  </div>

}

export default AchievementItem;