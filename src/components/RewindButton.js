import React from 'react';
import PropTypes from 'prop-types';

import Button from './Button/Button';

import { gameboy, GameBoyEmulatorPlaying as gameBoyEmulatorPlaying, saveState, pause, run } from '../cores/GameBoy-Online/js/index';

export default class RewindButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    const snapshots = [];

    const BACKUPS = 60,
          BACKUP_INTERVAL = 1000;

    const record = ()=> {
      if(!gameBoyEmulatorPlaying()) {
        setTimeout(record, BACKUP_INTERVAL);
        return;
      }

      snapshots.push(gameboy.saveState());

      saveState(`auto`);

      while(snapshots.length > BACKUPS) {
        snapshots.shift();
      }

      setTimeout(record, BACKUP_INTERVAL);
    };

    setTimeout(record, BACKUP_INTERVAL);

    let rewindTimeout = null;
    const REWIND_INTERVAL = 333;

    this.rewind = ()=> {
      if(snapshots.length) {
        gameboy.returnFromState(snapshots.pop());
        gameboy.run(`force`);
        gameboy.stopEmulator = 3;

        rewindTimeout = setTimeout(this.rewind, REWIND_INTERVAL);
      } else {
        clearTimeout(rewindTimeout);
        run();
      }
    };

    this.events = {
      down: ()=> {
        pause();
        rewindTimeout = setTimeout(this.rewind, REWIND_INTERVAL);
      },
      up: ()=> {
        clearTimeout(rewindTimeout);

        if(!gameBoyEmulatorPlaying()) {
          run();
        }
      }
    };
  }

  render() {
    return (
      <Button
        className={this.props.className}
        pointerCommands={this.events}
        keyCommands={{ [this.props.kb]: this.events }}
      >
        {this.props.children}
      </Button>
    );
  }
}

RewindButton.propTypes = {
  kb: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.node
};