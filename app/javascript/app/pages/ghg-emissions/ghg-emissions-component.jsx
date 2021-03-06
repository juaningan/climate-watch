import React, { PureComponent } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import Header from 'components/header';
import Intro from 'components/intro';
import GhgEmissionsGraph from 'components/ghg-emissions';
import { HISTORICAL_GHG_EMISIONS } from 'data/SEO';
import { MetaDescription, SocialMetadata } from 'components/seo';
import { isPageContained } from 'utils/navigation';

import layout from 'styles/layout.scss';
import styles from './ghg-emissions-styles.scss';

const FEATURE_NEW_GHG = process.env.FEATURE_NEW_GHG === 'true';

class GhgEmissions extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const { route } = this.props;
    return (
      <div>
        <MetaDescription
          descriptionContext={HISTORICAL_GHG_EMISIONS}
          subtitle="GHG emissions"
        />
        <SocialMetadata
          descriptionContext={HISTORICAL_GHG_EMISIONS}
          href={location.href}
        />
        {!isPageContained && (
          <Header route={route}>
            <div className={cx(layout.content, styles.header)}>
              <Intro
                title="Historical GHG Emissions"
                description={
                  FEATURE_NEW_GHG &&
                  'Climate change causing greenhouse gas emissions have increased 50 fold since the late 1800s. Energy makes up nearly two-thirds of global emissions, followed by agriculture. Within the energy sector, electricity and heat generation make up the largest portion of emissions, followed by transportation and manufacturing. In 2014, 60% of global greenhouse gas emissions came from just 10 countries, while the 100 least-emitting contributed less than 3%. '
                }
              />
            </div>
          </Header>
        )}
        <div className={styles.wrapper}>
          <div className={layout.content}>
            <GhgEmissionsGraph />
          </div>
        </div>
      </div>
    );
  }
}

GhgEmissions.propTypes = {
  route: PropTypes.object.isRequired
};

export default GhgEmissions;
