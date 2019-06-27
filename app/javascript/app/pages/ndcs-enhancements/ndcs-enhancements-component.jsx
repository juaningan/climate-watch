import React from 'react';
import { renderRoutes } from 'react-router-config';
import Proptypes from 'prop-types';
import Header from 'components/header';
import Intro from 'components/intro';
import AutocompleteSearch from 'components/autocomplete-search';
import { NDC_ENHANCEMENTS } from 'data/SEO';
import { MetaDescription, SocialMetadata } from 'components/seo';

import layout from 'styles/layout.scss';
import styles from './ndcs-enhancements-styles.scss';

const NDCSEnhancements = ({ query, route }) => (
  <div>
    <MetaDescription
      descriptionContext={NDC_ENHANCEMENTS}
      subtitle="NDC ENHANCEMENTS"
    />
    <SocialMetadata
      descriptionContext={NDC_ENHANCEMENTS}
      href={location.href}
    />
    <Header route={route}>
      <div className={layout.content}>
        <div className="grid-column-item">
          <div className={styles.headerLayout}>
            <Intro
              title="2020 Ambition Tracker"
              description={`<p>The Paris Agreement calls for countries to come back to the table every five years – in 2020, 2025 and so on -- with new national climate commitments (NDCs) informed by the latest advances in technology, science and shifting economic trends.</p>`}
            />
            <AutocompleteSearch />
          </div>
        </div>
      </div>
    </Header>
    <div className={styles.wrapper}>
      <div className={layout.content}>
        {route.sections &&
          route.sections.length > 0 &&
          route.sections.map(section => (
            <div className={styles.section}>
              <div id={section.hash} className={styles.sectionHash} />
              <section.component />
            </div>
          ))}
      </div>
    </div>
  </div>
);

NDCSEnhancements.propTypes = {
  query: Proptypes.string,
  route: Proptypes.object.isRequired
};

export default NDCSEnhancements;
