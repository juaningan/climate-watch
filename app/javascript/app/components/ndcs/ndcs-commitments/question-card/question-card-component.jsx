import React from 'react';
import PropTypes from 'prop-types';
import Progress from 'components/progress';
import Icon from 'components/icon';
import infoIcon from 'assets/icons/info.svg';
import ReactTooltip from 'react-tooltip';
import styles from './question-card.scss';

const QuestionCard = ({ link, questionText, questionStats }) => {
  const { answerNumber, maxPartiesNumber, percentage } = questionStats || {};
  return (
    <a
      className={styles.questionCard}
      href={link}
      target="_blank"
      title="Paris agreement - Status of ratification"
    >
      <button
        title="Information"
        className={styles.infoButton}
        data-for="info-button"
        data-tip="Information"
      >
        <Icon icon={infoIcon} />
        <ReactTooltip id="info-button" effect="solid" />
      </button>
      <div className={styles.questionText}>{questionText}</div>
      <div className={styles.answerText}>
        <span className={styles.answerNumber}>{answerNumber}</span> out of{' '}
        {maxPartiesNumber} covering
        <span className={styles.percentage}>{percentage}%</span> of the total
        GHG
      </div>
      <Progress
        value={(answerNumber / maxPartiesNumber) * 100}
        className={styles.progressBar}
        color="#FF6C2F"
      />
    </a>
  );
};

QuestionCard.propTypes = {
  questionText: PropTypes.string,
  link: PropTypes.string,
  questionStats: PropTypes.object
};

export default QuestionCard;
