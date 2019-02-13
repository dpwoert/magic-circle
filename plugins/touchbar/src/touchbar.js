const { app, BrowserWindow, TouchBar } = require('electron').remote;
const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar;

const BARS = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];

class Touchbar {
  static name = 'Touchbar';

  static electronOnly = true;

  constructor(client) {
    this.client = client;
    this.update = this.update.bind(this);

    this.client.addListener('connect', () => this.create());
  }

  create() {
    this.pageInfo = new TouchBarLabel();
    this.fpsValue = new TouchBarLabel();
    this.fpsBars = new TouchBarLabel();
    this.fpsWarning = new TouchBarLabel();
    this.touchBar = new TouchBar([
      this.pageInfo,
      new TouchBarSpacer({ size: 'large' }),
      this.fpsValue,
      new TouchBarSpacer({ size: 'small' }),
      this.fpsBars,
      new TouchBarSpacer({ size: 'small' }),
      this.fpsWarning,
    ]);

    BrowserWindow.getAllWindows().forEach(w => w.setTouchBar(this.touchBar));

    this.update();
  }

  update() {
    const pageInformation = this.client.getPlugin('page-information').store;
    this.pageInfo.label = pageInformation.get('title');

    const performance = this.client.getPlugin('performance').store;
    const fps = performance.get('FPS') || [];
    const last5 = fps.slice(-5);
    const bars = last5.map(v =>
      v > 0 ? BARS[Math.round((BARS.length - 1) * (v / 60))] : '▁'
    );
    const barsStr = bars.join('');
    const currFps = fps[fps.length - 1] > 0 ? fps[fps.length - 1] : 0;
    this.fpsValue.label = `fps: ${currFps}`;
    this.fpsBars.label = barsStr;
    this.fpsBars.textColor = '#A094B8';
    this.fpsWarning.label = currFps < 30 ? '⚠️' : '';

    setTimeout(this.update, 1000);
  }
}

export default Touchbar;
