import { AsyncAction } from './AsyncAction';
import { AsyncScheduler } from './AsyncScheduler';
import { SchedulerKind } from '../Scheduler';

export class AnimationFrameScheduler extends AsyncScheduler {
  public kind = SchedulerKind.ANIMATION_FRAME;

  public flush(action?: AsyncAction<any>): void {

    this.active = true;
    this.scheduled = undefined;

    const {actions} = this;
    let error: any;
    let index: number = -1;
    let count: number = actions.length;
    action = action || actions.shift();

    do {
      if (error = action.execute(action.state, action.delay)) {
        break;
      }
    } while (++index < count && (action = actions.shift()));

    this.active = false;

    if (error) {
      while (++index < count && (action = actions.shift())) {
        action.unsubscribe();
      }
      throw error;
    }
  }
}
