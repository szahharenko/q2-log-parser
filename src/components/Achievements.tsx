import { useEffect, useState } from 'react';
import { HeadHunterAchievement, PlayerStats, Achievement } from '../types/types';
import { calculateHeadHunter, calculateMostBlasterKills, calculateMostChats, calculateMostEventStreak, calculateMostGrenadeKills, calculateMostQuads, calculateMostTelefrags, calculateNoMercyForMinions, calculateSpecialist, calculateWrongTurn, getBestFragAchievers, getDominatorAchievers, getLeastUsedWeapon, getWftAchievers, getWillPowerAchievers } from '../utils/functions';
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
import Lmaster from '../img/Lmaster.png';
import Qhero from '../img/Qhero.png';
import Mapmaker from '../img/Mapmaker.png';
import AchievementItem from './Achivement';
import { getPlayer } from '../utils/getPlayer';

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
    const activePlayer = getPlayer();


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
        setWillPower(getWillPowerAchievers(playerStats));
    }, [playerStats, weaponStats]);

    useEffect(() => {
      const playerList = Object.keys(playerStats);
      const hasTet = playerList.some(name => ['spacer', 'tet'].includes(name.toLowerCase()));
      if (hasTet) {
        const tetKillers = Object.entries(playerStats).map(([player, stats]) => ({
          player, killsOnTet: stats.killBreakdown['Spacer'] || stats.killBreakdown['spacer'] || stats.killBreakdown['tet'] || 0
        }));
        setTetSuicides(playerStats['Spacer']?.suicides || playerStats['spacer']?.suicides || playerStats['tet']?.suicides || 0);
        setTetKiller(tetKillers);
      }
    }, [playerStats]);

    useEffect(() => {
        const leastUsedWeapon = getLeastUsedWeapon(weaponStats);
        setLeastUsedWeapon(leastUsedWeapon);
        playerStats && leastUsedWeapon && setSpecialist(calculateSpecialist(leastUsedWeapon?.weapon, playerStats));
    }, [playerStats, weaponStats]);

    const formatSubtitle = (text: string) => {
      return <small  style={{marginTop: '10px', opacity: 0.5, display: 'block'}}>{text}</small>
    }

    return <>
      <div className='page' style={{ margin: '30px 0' }}>

        <h2>{ lang === 'en' ? 'Prize Pool 🏆💰 Achievements' : 'Призовые 🏆💰 Достижения'}</h2>
        <div className='achievements-list page'>

          <AchievementItem title={'Best Frag'} achievement={bestFrag} image={Best_frag}
            text={{
              en: <div>
                <strong>{bestFrag?.achievers.join(' & ')}</strong> catches the moment your crosshair and destiny had perfect chemistry.
                { formatSubtitle('Viewer’s Choice: Best Tournament Frag.')}
              </div>,
              ru: <div>
                <strong>{bestFrag?.achievers.join(' & ')}</strong> поймал момент, когда прицел и судьба идеально сошлись.
                { formatSubtitle('Самый зрелищный фраг турнира по мнению аудитории.')}
              </div>
            }}
          />

          <AchievementItem title={'WTF Moment'} achievement={wft} image={WFT_moment}
            text={{
              en: <>
                <strong>{wft?.achievers.join(' & ')}</strong> wanted to make it look cool… and ended up earning an achievement instead.
                { formatSubtitle('Viewer’s Choice: Most Bizarre Moment of the Tournament')}
              </>,
              ru: <>
                <strong>{wft?.achievers.join(' & ')}</strong> хотел сделать красиво, а получилось... достижение.
                { formatSubtitle('Самый курьёзный момент турнира по мнению аудитории')}
              </>
            }}
          />

          <AchievementItem title={'Dominator'} achievement={dominator} image={Dominator}
            text={{
              en: <>
                <strong>{dominator?.achievers.join(' & ')}</strong> dominated the arena with unstoppable force.
                { formatSubtitle('Player Who Has the Longest Win Streak.')}
              </>,
              ru: <>
                <strong>{dominator?.achievers.join(' & ')}</strong> доминировал на арене с неудержимой силой.
                { formatSubtitle('Cамая длинная череда побед без поражений.')}
              </>
            }}
          />

          <AchievementItem title={'Quad maniac'} achievement={mostQuads} image={Quad_maniac}
            text={{
              en: <>
                <strong>{mostQuads?.achievers.join(' & ')}</strong> picked up Quad <strong>{mostQuads?.count}</strong> times and turned the match into a one-sided massacre.
                 { formatSubtitle('Player Who Picked Up the Most Quads.')}

              </>,
              ru: <>
                <strong>{mostQuads?.achievers.join(' & ')}</strong> урвал Quad <strong>{mostQuads?.count}</strong> раз и матч превратился в казнь.
                 { formatSubtitle('Больше всех утащил Quad Damage.') }
              </>
            }}
          />

          <AchievementItem title={'Head Hunter'} achievement={headHunter} image={Head_hunter}
            text={{
              en: <>
                <strong>{headHunter?.hunter}</strong> is the Head Hunter for killing the group leader (<strong>{headHunter?.leader}</strong>) {headHunter?.killsOnLeader} {headHunter?.killsOnLeader || 0 > 1 ? 'times' : 'time'}!
                { formatSubtitle('Player Who Killed the Most Group Leaders.') }
              </>,
              ru: <>
                <strong>{headHunter?.hunter}</strong> — охотник за головами, убивший лидера группы (<strong>{headHunter?.leader}</strong>) убив его {headHunter?.killsOnLeader} раз!
                { formatSubtitle('Больше всех завалил лидера группы.') }
              </>
            }}
          />

          <AchievementItem title={'Respawn Hero'} achievement={mostTelefrags} image={Respawn_hero}
            text={{
              en: <>
                <strong>{mostTelefrags?.achievers.join(' & ')}</strong> {mostTelefrags?.achievers.length || 0 > 1 ? 'share the award' : 'gets the award'} with <strong>{mostTelefrags?.count}</strong> telefrags!
                { formatSubtitle('Player Who Has Most Telefrag Kills.') }
              </>,
              ru: <>
                <strong>{mostTelefrags?.achievers.join(' & ')}</strong> {mostTelefrags?.achievers.length || 0> 1 ? 'делят награду' : 'получает награду'} с <strong>{mostTelefrags?.count}</strong> телефрагами!
                { formatSubtitle('Наибольшее количество телефрагов.') }
              </>
            }}
          />

          <AchievementItem title={'Wrong turn'} achievement={wrongTurn} image={Wrong_turn}
            text={{
              en: <>
                <strong>{wrongTurn?.achievers.join(' & ')}</strong> took a wrong turn {wrongTurn?.count} {wrongTurn?.count || 0 > 1 ? 'times' : 'time'} to earn this award.
                { formatSubtitle('Player Who Died the Most in Acid or Lava.') }
              </>,
              ru: <>
                Чтобы получить эту награду, <strong>{wrongTurn?.achievers.join(' & ')}</strong> {wrongTurn?.count} раз свернул не туда.
                { formatSubtitle('Наибольшее количество смертей в кислоте и лаве.') }
              </>
            }}
          />

          <AchievementItem title={'Grenadier'} achievement={mostGrenades} image={Grenadier}
            text={{
              en: <>
                <strong>{mostGrenades?.achievers.join(' & ')}</strong> earned the top spot with <strong>{mostGrenades?.count}</strong> grenade kills!
                { formatSubtitle('Player Who Scored the Most Grenade and Hand Grenade Kills.') }
              </>,
              ru: <>
                <strong>{mostGrenades?.achievers.join(' & ')}</strong> занял первое место, совершив <strong>{mostGrenades?.count}</strong> убийств(а) гранатами!
                { formatSubtitle('Наибольшее количество фрагов  ручными гранатами и из гранатомёта.') }
              </>
            }}
          />

          <AchievementItem title={'Troublemaker'} achievement={mostEventStreak} image={Troublemaker}
            text={{
              en: <>
                <strong>{mostEventStreak?.achievers.join(' & ')}</strong> caused chaos with an event streak of <strong>{mostEventStreak?.count}</strong>!
                { formatSubtitle('Longest Console Log Streak made by player.') }
              </>,
              ru: <>
                <strong>{mostEventStreak?.achievers.join(' & ')}</strong> вызвал хаос с серией событий длинной в <strong>{mostEventStreak?.count}</strong>!
                { formatSubtitle('Самая длинная серия упоминаний игрока в консоли.') }
              </>
            }}
          />

          <AchievementItem title={'Will Power'} achievement={willPower} image={Will_power}
            text={{
              en: <>
                <strong>{willPower?.achievers.join(' & ')}</strong> demonstrated unwavering willpower in the face of adversity.
                { formatSubtitle('Player Who Finished Last the Most Times.') }
              </>,
              ru: <>
                <strong>{willPower?.achievers.join(' & ')}</strong> продемонстрировал непоколебимую силу воли перед лицом невзгод.
                { formatSubtitle('Наибольшее количество последних мест в турнире.') }
              </>
            }}
          />
        </div>

        <h2>{ lang === 'en' ? 'Bonus 🏆🌟 Perks' : 'Бонусные 🏆🌟 Навыки'}</h2>
        <div className='achievements-list page'>

          <AchievementItem cssClass={'bonus'} title={'Zero tolerance'} achievement={mostBully} image={Zero_tolerance}
            text={{
              en: <><strong>{mostBully?.hunter}</strong> Has no mercy for weakest by killing <strong>{mostBully?.leader}</strong> {mostBully?.killsOnLeader} {mostBully?.killsOnLeader || 0 > 1 ? 'times' : 'time'}!</>,
              ru: <><strong>{mostBully?.hunter}</strong> не щадит самых слабых, убив <strong>{mostBully?.leader}</strong> {mostBully?.killsOnLeader} раз!</>
            }}
          />

          <AchievementItem cssClass={'bonus'} title={'Optimist'} achievement={mostBlaster} image={Optimist}
            text={{
              en: <><strong>{mostBlaster?.achievers.join(' & ')}</strong> tops the charts with <strong>{mostBlaster?.count}</strong> blaster kills!</>,
              ru: <><strong>{mostBlaster?.achievers.join(' & ')}</strong> возглавляет чарты, убив <strong>{mostBlaster?.count}</strong> противников из бластера!</>
            }}
          />

          { /* Player with most kills from Least used weapon */}
          {
            leastUsedWeapon && specialist && (activePlayer ? specialist.player.toLocaleLowerCase() === activePlayer : true) && (
              <div className='achievement bonus'>
                <div className='icon'><img src={ Boomstick_baron } alt='tet'/></div>
                <div>
                  <h3>Boomstick baron</h3>
                  { lang === 'en' ?
                    <div>
                      <strong>{specialist.player}</strong> mastered the <strong>{specialist.weapon}</strong> with <strong>{specialist.kills}</strong> kills, the least used weapon with only <strong>{leastUsedWeapon.count}</strong> total kills!
                    </div>
                    :
                    <div>
                      <strong>{specialist.player}</strong> в совершенстве освоил <strong>{specialist.weapon}</strong>, совершив <strong>{specialist.kills}</strong> убийств(а) — это наименее используемое оружие, с которым было совершено всего <strong>{leastUsedWeapon.count}</strong> убийств(а)!
                    </div>
                  }
                </div>
              </div>
            )
          }

          <AchievementItem cssClass={'bonus'} title={'Chat lord'} achievement={mostChats} image={Chat_lord}
            text={{
              en: <><strong>{mostChats?.achievers.join(' & ')}</strong> leads the chatter with <strong>{mostChats?.count}</strong> chat messages!</>,
              ru: <><strong>{mostChats?.achievers.join(' & ')}</strong> лидирует в чате с <strong>{mostChats?.count}</strong> сообщениями!</>
            }}
          />

        </div>

        { /* personalized achievements section */ }
        <h2>{ lang === 'en' ? 'Personal rewards 🎖️' : 'Персональные награды 🎖️'}</h2>
        <div className='achievements-list page'>
          {
            (activePlayer ? activePlayer === 'spacer' || activePlayer === 'tet' : true) && tetKillers && lang !== 'en' && (
              <div className='achievement personal'>
                <div className='icon'><img src={Dartagnan} alt='tet'/></div>
                <div>
                  персональная награда <strong>Spacer-а</strong>
                  <h3>Д`Артаньян</h3>

                  <p>Читеры замешанные в деле</p>
                  <ul>
                  {
                    tetKillers.sort((a, b) => b.killsOnTet - a.killsOnTet).map(({ player, killsOnTet }, index) => {
                      const epitet = ['нечестно', 'гнусно', 'подло', 'вероломно', 'коварно', 'хитрожопо', 'мерзко', 'гадко', 'грязно', 'низменно', 'предательски'];
                      return killsOnTet === 0 ? null : <li key={player} style={{ fontSize: '80%' }}>
                        <strong>{player}</strong> {epitet[index]} убил Spacer-а <strong>{killsOnTet}</strong> раз(а)
                      </li>
                    })
                  }
                  </ul>
                  <p>Предательски принёс себя в жертву <strong>{tetSuicides}</strong> раз(а).</p>
                </div>
              </div>
            )
          }
          {
            (activePlayer ? activePlayer === 'q' : true) && lang !== 'en' && (
              <div className='achievement personal'>
                <div className='icon'><img src={Sponsor} alt='tet'/></div>
                <div>
                  персональная награда <strong>Q</strong>
                  <h3>Спонсор Шрёдингера</h3>
                  <p>Квантовая неопределенность приносит <strong>q</strong> 666 бонусных очков.</p>
                </div>
              </div>
            )
          }
          {
            (activePlayer ? activePlayer === 'sparkq2' : true) && lang !== 'en' && (
            <div className='achievement personal'>
              <div className='icon'><img src={Mapmaker} alt='tet'/></div>
              <div>
                персональная награда <strong>SparkQ2</strong>
                <h3>Map maker</h3>
                <p>Конверсия Corrupted Keep для турнира</p>
              </div>
            </div>
          )}
          {
            (activePlayer ? activePlayer === 'werwolf' : true) && lang !== 'en' && (
              <div className='achievement personal'>
                <div className='icon'><img src={Lmaster} alt='tet'/></div>
                <div>
                  персональная награда <strong>WerWolf</strong>
                  <h3>Liquidpedia master</h3>
                  <p>за исторический вклад в оформление турнира</p>
                </div>
              </div>
          )}
          {
            (activePlayer ? activePlayer === 'tim' : true) && lang !== 'en' && (
              <div className='achievement personal'>
                <div className='icon'><img src={Qhero} alt='tet'/></div>
                <div>
                  персональная награда <strong>TIM</strong>
                  <h3>Qualification hero</h3>
                  <p>Обыграл Давида на его сильнейшей карте</p>
                </div>
              </div>
          )}
        </div>
      </div>
    </>
}