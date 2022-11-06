import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';
import Link from '@docusaurus/Link';

type FeatureItem = {
  title: string;
  Svg?: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Who is this course for?',
    Svg: require('@site/static/img/absurd_glasses.svg').default,
    description: (
      <>
        Software developers (and security engineers) that have been tasked with defending a system
        or just want to learn what to do with SE Linux other than disabling it! 
      </>
    ),
  },
  {
    title: 'What can I expect when I complete it?',
    Svg: require('@site/static/img/undraw_powerful.svg').default,
    description: (
      <>
        You'll be able to design, debug, package and test an SE Linux policy.  
      </>
    ),
  },
  {
    title: 'What does it cost?',
    Svg: require('@site/static/img/undraw_savings.svg').default,
    description: (
      <>
        It's free (other than your time), if you do use it I'm hoping you'll <a href="https://github.com/joekir/selinuxuser.land/issues">report bugs</a> or confusing parts so you can pay it forward though ;)
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className='text--center'>
        <Svg className={styles.featureSvg} role='img' />
      </div>
      <div className='text--center padding-horiz--md'>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className='container'>
        <div className='row'>
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
        <div className='text--center'>
          <Link
            className='button button--secondary button--lg'
            to='/course/overview'>
            Lets Get Started!
          </Link>
        </div>
      </div>
    </section>
  );
}
