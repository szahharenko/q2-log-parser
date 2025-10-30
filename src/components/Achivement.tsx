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
    const hasAchievement = (achievement && 'achievers' in achievement && achievement.achievers.map(p => p.toLocaleLowerCase()).includes(player || ''));
    const isHunter = achievement && 'hunter' in achievement && achievement.hunter.toLocaleLowerCase() === player;
    const hasPlayer = player && (hasAchievement || isHunter);
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