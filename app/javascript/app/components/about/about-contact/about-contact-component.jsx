import React from 'react';
import cx from 'classnames';
import layout from 'styles/layout';
import styles from './about-contact-styles.scss';

const AboutContact = () => (
  <div className={cx(styles.aboutContact, layout.content)}>
    <p>
      We’d love to hear from you. Please submit questions, comments or feedback
      to <a href="mailto:ClimateWatch@WRI.org">ClimateWatch@WRI.org</a>
    </p>
    <h3>Sign Up for Updates</h3>
    <p>
      Subscribe to our newsletter for updates and events on Climate Watch and
      other climate-related tools.
    </p>
    <iframe
      title="contact-form"
      className={styles.contactIframe}
      src="//go.pardot.com/l/120942/2017-09-11/3khdjq"
      frameBorder="0"
    />
  </div>
);

export default AboutContact;
