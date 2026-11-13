import { event } from '../data/event';
import { Title } from './Title';
import { t } from '../i18n/ui';
import { dateLong } from '../lib/event-helpers';
import { Flourish, Star } from './Ornaments';

export function Programme() {
  const pr = event.programme;
  return (
    <section className="programme" id="programme" aria-labelledby="programme-title">
      <div className="wrap">
        <header className="sec-head sec-head--center reveal">
          <p className="eyebrow">{dateLong()}</p>
          <h2 id="programme-title" className="display">
            <Title parts={t.programme.title} />
          </h2>
          <Flourish />
          <p className="sec-note">{pr.note}</p>
        </header>

        <ol className="timeline">
          {pr.schedule.map((item) => (
            <li className="tl-item reveal" key={item.time}>
              <p className="tl-time">
                <time>{item.time}</time>
                <small>{t.programme.planned}</small>
              </p>
              <span className="tl-node">
                <Star />
              </span>
              <div className="tl-body">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="themes">
          <h3 className="themes-title reveal">
            <span>{t.programme.themes}</span>
          </h3>
          <ul className="theme-list">
            {pr.themes.map((th) => (
              <li className="theme reveal" key={th.numeral}>
                <span className="theme-medal" aria-hidden="true">
                  {th.numeral}
                </span>
                <h4>{th.title}</h4>
                <p>{th.text}</p>
                <p className="theme-note">{th.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
