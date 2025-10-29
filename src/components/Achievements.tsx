import { useEffect, useState } from 'react';
import { HeadHunterAchievement, PlayerStats, Achievement } from '../types/types';
import { calculateHeadHunter, calculateMostBlasterKills, calculateMostChats, calculateMostEventStreak, calculateMostGrenadeKills, calculateMostQuads, calculateMostTelefrags, calculateNoMercyForMinions, calculateSpecialist, calculateWrongTurn, getBestFragAchievers, getDominatorAchievers, getLeastUsedWeapon, getWftAchievers } from '../utils/functions';
import { getLanguage } from '../utils/getLanguage';

import Sponsor from '../img/Sponsor.png'; // Tell webpack this JS file uses this image
import Quad_maniac from '../img/Quad_maniac.png'; // Tell webpack this JS file uses this image
import Dartagnan from '../img/Dartagnan.png'; // Tell webpack this JS file uses this image
import Chat_lord from '../img/Chat_lord.png'; // Tell webpack this JS file uses this image
import Boomstick_baron from '../img/Boomstick_baron.png'; // Tell webpack this JS file uses this image
import Dominator from '../img/Dominator.png'; // Tell webpack this JS file uses this image
import Grenadier from '../img/Grenadier.png'; // Tell webpack this JS file uses this image
import Head_hunter from '../img/Head_hunter.png'; // Tell webpack this JS file uses this image
import Optimist from '../img/Optimist.png';
import Respawn_hero from '../img/Respawn_hero.png';
import Troublemaker from '../img/Troublemaker.png';
import Wrong_turn from '../img/Wrong_turn.png';
import Zero_tolerance from '../img/Zero_tolerance.png';
import Best_frag from '../img/Best_frag.png';
import WFT_moment from '../img/WTF_moment.png';
import Will_power from '../img/Will_power.png';
import Q2 from '../img/Q2.png';

interface AchievementsProps {
    playerStats: Record<string, PlayerStats>;
    weaponStats: Record<string, number> | null;
    nonGameEvents?: string[];
}

export const Achievements = ({playerStats, weaponStats, nonGameEvents}: AchievementsProps) => {

    const [mostQuads, setMostQuads] = useState<Achievement | null>(null);
    const [bestFrag, setBestFrag] = useState<Achievement | null>(null);
    const [wft, setWft] = useState<Achievement | null>(null);
    const [dominator, setDominator] = useState<Achievement | null>(null);
    const [willPower, setWillPower] = useState<Achievement | null>(null);
    const [headHunter, setHeadHunter] = useState<HeadHunterAchievement | null>(null);
    const [mostTelefrags, setMostTelefrags] = useState<Achievement | null>(null);
    const [wrongTurn, setWrongTurn] = useState<Achievement | null>(null);
    const [mostEventStreak, setMostEventStreak] = useState<Achievement | null>(null);
    const [mostBully, setMostBully] = useState<HeadHunterAchievement | null>(null);
    const [mostGrenades, setMostGrenades] = useState<Achievement | null>(null);
    const [mostBlaster, setMostBlaster] = useState<Achievement | null>(null);
    const [leastUsedWeapon, setLeastUsedWeapon] = useState<{ weapon: string; count: number } | null>(null);
    const [specialist, setSpecialist] = useState<{ player: string; weapon: string; kills: number } | null>(null);
    const [tetKillers, setTetKiller] = useState<{ player: string; killsOnTet: number }[] | null>(null);
    const [tetSuicides, setTetSuicides] = useState<number | null>(null);
    const [mostChats, setMostChats] = useState<Achievement | null>(null);
    const lang = getLanguage();


    useEffect(() => {
        setHeadHunter(calculateHeadHunter(playerStats));
        setMostTelefrags(calculateMostTelefrags(playerStats));
        setWrongTurn(calculateWrongTurn(playerStats));
        setMostGrenades(calculateMostGrenadeKills(playerStats));
        setMostBlaster(calculateMostBlasterKills(playerStats));
        setMostEventStreak(calculateMostEventStreak(playerStats));
        setMostBully(calculateNoMercyForMinions(playerStats));
        setMostChats(calculateMostChats(playerStats));
        setMostQuads(calculateMostQuads(playerStats));
        setBestFrag(getBestFragAchievers(playerStats));
        setWft(getWftAchievers(playerStats));
        setDominator(getDominatorAchievers(playerStats));
        setWillPower(getWftAchievers(playerStats));
    }, [playerStats, weaponStats]);

    useEffect(() => {
      const hasTet = Object.keys(playerStats).some(name => name.toLowerCase().includes('tet'));
      if (hasTet) {
        const tetKillers = Object.entries(playerStats).map(([player, stats]) => ({
          player, killsOnTet: stats.killBreakdown['tet'] || 0
        }));
        ;
        setTetSuicides(playerStats['tet']?.suicides || 0);
        setTetKiller(tetKillers);
      }
    }, [playerStats]);

    useEffect(() => {
        const leastUsedWeapon = getLeastUsedWeapon(weaponStats);
        setLeastUsedWeapon(leastUsedWeapon);
        playerStats && leastUsedWeapon && setSpecialist(calculateSpecialist(leastUsedWeapon?.weapon, playerStats));
    }, [playerStats, weaponStats]);

    return <>
      <div className='page' style={{ margin: '30px 0' }}>

        <h2>{ lang === 'en' ? 'Prize Pool 🏆💰 Achievements' : 'Призовые 🏆💰 Достижения'}</h2>
        <div className='achievements-list page'>


          <div className='achievement'>
            <div className='icon'><img src={ Best_frag } alt='tet'/></div>
            <div>
              <h3 >Best Frag</h3>
              { bestFrag ?
                lang === 'en' ?
                  <p>
                    <strong>{bestFrag.achievers.join(' & ')}</strong> catches the moment your crosshair and destiny had perfect chemistry.
                  </p>
                  :
                  <p>
                    <strong>{bestFrag.achievers.join(' & ')}</strong> поймал момент, когда прицел и судьба идеально сошлись.
                  </p>
                :
                <p>TBA</p>
              }
            </div>
          </div>

          <div className='achievement'>
            <div className='icon'><img src={ WFT_moment } alt='tet'/></div>
            <div>
              <h3 >WFT Moment</h3>
              {wft ?
                lang === 'en' ?
                  <p>
                    <strong>{wft.achievers.join(' & ')}</strong> wanted to make it look cool… and ended up earning an achievement instead.
                  </p>
                  :
                  <p>
                    <strong>{wft.achievers.join(' & ')}</strong> хотел сделать красиво, а получилось... достижение.
                  </p>
                :
                <p>TBA</p>
              }
            </div>
          </div>

          <div className='achievement'>
            <div className='icon'><img src={ Dominator } alt='tet'/></div>
            <div>
              <h3>Dominator</h3>
              {dominator ?
                lang === 'en' ?
                  <p>
                    <strong>{dominator.achievers.join(' & ')}</strong> dominated the arena with unstoppable force.
                  </p>
                  :
                  <p>
                    <strong>{dominator.achievers.join(' & ')}</strong> доминировал на арене с неудержимой силой.
                  </p>
                :
                <p>TBA</p>
              }
            </div>
          </div>

          <div className='achievement'>
            <div className='icon'><img src={ Quad_maniac } alt='tet'/></div>
            <div>
              <h3>Quad maniac</h3>
              { mostQuads ?
                lang === 'en' ?
                <p>
                  <strong>{mostQuads.achievers.join(' & ')}</strong> picked up Quad <strong>{mostQuads.count}</strong> times and turned the match into a one-sided massacre.
                </p>
                :
                <p>
                  <strong>{mostQuads.achievers.join(' & ')}</strong> урвал Quad <strong>{mostQuads.count}</strong> раз и матч превратился в казнь.
                </p>
                :
                <p>TBA</p>
              }
            </div>
          </div>


          {headHunter && (
            <div className='achievement'>
              <div className='icon'><img src={ Head_hunter } alt='tet'/></div>
              <div>
                <h3 >Head Hunter</h3>
                { lang === 'en' ?
                  <p>
                    <strong>{headHunter.hunter}</strong> is the Head Hunter for killing the group leader (<strong>{headHunter.leader}</strong>) {headHunter.killsOnLeader} {headHunter.killsOnLeader > 1 ? 'times' : 'time'}!
                  </p>
                  :
                  <p>
                    <strong>{headHunter.hunter}</strong> — охотник за головами, убивший лидера группы (<strong>{headHunter.leader}</strong>) убив его {headHunter.killsOnLeader} раз!
                  </p>
                }
              </div>
            </div>
          )}

          {mostTelefrags && (
              <div className='achievement'>
                <div className='icon'><img src={ Respawn_hero } alt='tet'/></div>
                <div>
                  <h3 >Respawn Hero</h3>
                  { lang === 'en' ?
                    <p>
                      <strong>{mostTelefrags.achievers.join(' & ')}</strong> {mostTelefrags.achievers.length > 1 ? 'share the award' : 'gets the award'} with <strong>{mostTelefrags.count}</strong> telefrags!
                    </p>
                    :
                    <p>
                      <strong>{mostTelefrags.achievers.join(' & ')}</strong> {mostTelefrags.achievers.length > 1 ? 'делят награду' : 'получает награду'} с <strong>{mostTelefrags.count}</strong> телефрагами!
                    </p>
                  }
                </div>
              </div>
          )}

          {wrongTurn && (
            <div className='achievement'>
              <div className='icon'><img src={ Wrong_turn } alt='tet'/></div>
              <div>
                <h3 > Wrong Turn</h3>
                { lang === 'en' ?
                  <p>
                    <strong>{wrongTurn.achievers.join(' & ')}</strong> took a wrong turn {wrongTurn.count} {wrongTurn.count > 1 ? 'times' : 'time'} to earn this award.
                  </p>
                  :
                  <p>
                    Чтобы получить эту награду, <strong>{wrongTurn.achievers.join(' & ')}</strong> {wrongTurn.count} раз свернул не туда.
                  </p>
                }
              </div>
            </div>
          )}
          {mostGrenades && (
              <div className='achievement'>
                <div className='icon'><img src={ Grenadier } alt='tet'/></div>
                <div>
                  <h3 >Grenadier</h3> Гренадер
                  { lang === 'en' ?
                    <p>
                      <strong>{mostGrenades.achievers.join(' & ')}</strong> earned the top spot with <strong>{mostGrenades.count}</strong> grenade kills!
                    </p>
                    :
                    <p>
                      <strong>{mostGrenades.achievers.join(' & ')}</strong> занял первое место, совершив <strong>{mostGrenades.count}</strong> убийств(а) гранатами!
                    </p>
                  }
                </div>
              </div>
          )}

          {mostEventStreak && (
            <div className='achievement'>
              <div className='icon'><img src={ Troublemaker } alt='tet'/></div>
              <div>
                <h3 >Troublemaker</h3>Нарушитель спокойствия
                { lang === 'en' ?
                  <p>
                    <strong>{mostEventStreak.achievers.join(' & ')}</strong> caused chaos with an event streak of <strong>{mostEventStreak.count}</strong>!
                  </p>
                  :
                  <p>
                    <strong>{mostEventStreak.achievers.join(' & ')}</strong> вызвал хаос с серией событий длинной в <strong>{mostEventStreak.count}</strong>!
                  </p>
                }
              </div>
            </div>
          )}
          <div className='achievement'>
            <div className='icon'><img src={ Will_power } alt='tet'/></div>
            <div>
              <h3>Will power</h3>
              { willPower ?
                lang === 'en' ?
                  <p>
                    <strong>{willPower.achievers.join(' & ')}</strong> demonstrated unwavering willpower in the face of adversity.
                  </p>
                  :
                  <p>
                    <strong>{willPower.achievers.join(' & ')}</strong> продемонстрировал непоколебимую силу воли перед лицом невзгод.
                  </p>
                :
                <p>TBA</p>
              }
            </div>
          </div>
        </div>

        <h2>{ lang === 'en' ? 'Bonus 🏆🌟 Perks' : 'Бонусные 🏆🌟 Навыки'}</h2>
        <div className='achievements-list page'>
          {mostBully && (
            <div className='achievement bonus'>
              <div className='icon'><img src={ Zero_tolerance } alt='tet'/></div>
              <div>
                <h3 >Zero tolerance</h3>
                { lang === 'en' ?
                  <p>
                    <strong>{mostBully.hunter}</strong> Has no mercy for weakest by killing <strong>{mostBully.leader}</strong> {mostBully.killsOnLeader} {mostBully.killsOnLeader > 1 ? 'times' : 'time'}!
                  </p>
                  :
                  <p>
                    <strong>{mostBully.hunter}</strong> не щадит самых слабых, убив <strong>{mostBully.leader}</strong> {mostBully.killsOnLeader} раз!
                  </p>
                }
              </div>
            </div>
          )}

          { /* Blaster kills achievement */ }
          {mostBlaster && (
            <div className='achievement bonus'>
              <div className='icon'><img src={ Optimist } alt='tet'/></div>
              <div>
                <h3>Optimist</h3>
                { lang === 'en' ?
                    <p>
                      <strong>{mostBlaster.achievers.join(' & ')}</strong> tops the charts with <strong>{mostBlaster.count}</strong> blaster kills!
                    </p>
                  :
                    <p>
                      <strong>{mostBlaster.achievers.join(' & ')}</strong> возглавляет чарты, убив <strong>{mostBlaster.count}</strong> противников из бластера!
                    </p>
                }
              </div>
            </div>
          )}

          { /* Player with most kills from Least used weapon */}
          {
            leastUsedWeapon && specialist && (
              <div className='achievement bonus'>
                <div className='icon'><img src={ Boomstick_baron } alt='tet'/></div>
                <div>
                  <h3>Boomstick baron</h3>
                  { lang === 'en' ?
                    <p>
                      <strong>{specialist.player}</strong> mastered the <strong>{specialist.weapon}</strong> with <strong>{specialist.kills}</strong> kills, the least used weapon with only <strong>{leastUsedWeapon.count}</strong> total kills!
                    </p>
                    :
                    <p>
                      <strong>{specialist.player}</strong> в совершенстве освоил <strong>{specialist.weapon}</strong>, совершив <strong>{specialist.kills}</strong> убийств(а) — это наименее используемое оружие, с которым было совершено всего <strong>{leastUsedWeapon.count}</strong> убийств(а)!
                    </p>
                  }
                </div>
              </div>
            )
          }

          { /* Player who speaks to much */}
          {
            mostChats && (
              <div className='achievement bonus'>
                <div className='icon'><img src={ Chat_lord } alt='tet'/></div>
                <div>
                  <h3>Chat lord</h3>
                  { lang === 'en' ?
                    <>
                      <p><strong>{mostChats.achievers.join(' & ')}</strong> leads the chatter with <strong>{mostChats.count}</strong> chat messages!</p>
                    </>
                    :
                    <>
                      <p><strong>{mostChats.achievers.join(' & ')}</strong> лидирует в чате с <strong>{mostChats.count}</strong> сообщениями!</p>
                    </>
                  }
                </div>
              </div>
            )
          }
        </div>

        { /* personalized achievements section */ }
        <h2>{ lang === 'en' ? 'Personal rewards 🎖️' : 'Персональные награды 🎖️'}</h2>
        <div className='achievements-list page'>
          {
            tetKillers && lang !== 'en' && (
              <div className='achievement personal'>
                <div className='icon'><img src={Dartagnan} alt='tet'/></div>
                <div>
                  персональная награда <strong>Spacer</strong>
                  <h3>Д`Артаньян</h3>

                  <p>Читеры замешанные в деле</p>
                  <ul>
                  {
                    tetKillers.sort((a, b) => b.killsOnTet - a.killsOnTet).map(({ player, killsOnTet }, index) => {
                      const epitet = ['нечестно', 'гнусно', 'подло', 'вероломно', 'коварно', 'хитрожопо', 'мерзко', 'гадко', 'грязно', 'низменно', 'предательски'];
                      return killsOnTet === 0 ? null : <li key={player}>
                        <strong>{player}</strong> {epitet[index]} убил tet-а <strong>{killsOnTet}</strong> раз(а)
                      </li>
                    })
                  }
                  </ul>
                  <p>Да и сам tet молодец! Предательски самоликвидировался <strong>{tetSuicides}</strong> раз(а).</p>
                </div>
              </div>
            )
          }
          {
            lang !== 'en' && (
              <div className='achievement personal'>
                <div className='icon'><img src={Sponsor} alt='tet'/></div>
                <div>
                  персональная награда <strong>Q</strong>
                  <h3>Спонсор Шрёдингера</h3>
                  <p>Квантовая неопределенность приносит Q 666 бонусных очков.</p>
                </div>
              </div>
            )
          }
          <div className='achievement personal'>
            <div className='icon'><img src={Q2} alt='tet'/></div>
            <div>
              персональная награда <strong>SparkQ2</strong>
              <h3>Map maker</h3>
              <p>Конверсия Corrupted Keep для турнира</p>
            </div>
          </div>
          <div className='achievement personal'>
            <div className='icon'><img src={Q2} alt='tet'/></div>
            <div>
              персональная награда <strong>WerWolf</strong>
              <h3>Liquidpedia master</h3>
              <p>за исторический вклад в оформление турнира</p>
            </div>
          </div>
          <div className='achievement personal'>
            <div className='icon'><img src={Q2} alt='tet'/></div>
            <div>
              персональная награда <strong>TIM</strong>
              <h3>Qualification hero</h3>
              <p>Обыграл Давида на его сильнейшей карте</p>
            </div>
          </div>
        </div>
      </div>
    </>
}