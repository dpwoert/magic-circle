const { BrowserWindow, TouchBar, nativeImage } = require('electron').remote;

const {
  TouchBarLabel,
  TouchBarButton,
  TouchBarSpacer,
  TouchBarGroup,
} = TouchBar;

const BARS = ['▁', '▂', '▃', '▄', '▅', '▆', '▇', '█'];

const truncate = (string, max) =>
  string.length > max ? `${string.substring(0, max)}...` : string;

class Touchbar {
  static name = 'Touchbar';

  static electronOnly = true;

  constructor(client) {
    this.client = client;
    this.update = this.update.bind(this);

    this.client.addListener('connect', () => this.create());
    this.client.buttons.update(() => this.create());
  }

  create() {
    const buttons = Object.values(this.client.buttons.collection());
    const buttonsGrouped = buttons.map(group => {
      const items = group
        .filter(b => b.touchbar !== false)
        .map(b => {
          const iconPath = this.client.icons[b.icon].png;
          const icon = nativeImage.createFromPath(iconPath);
          return new TouchBarButton({
            icon,
            click: b.click,
          });
        });
      return new TouchBarGroup({ items });
    });

    const bar = [...buttonsGrouped, new TouchBarSpacer({ size: 'flexible' })];

    if (this.client.getPlugin('page-information')) {
      this.pageInfo = new TouchBarLabel();

      bar.push(new TouchBarSpacer({ size: 'flexible' }), this.pageInfo);
    }

    if (this.client.getPlugin('performance')) {
      this.fpsValue = new TouchBarLabel();
      this.fpsBars = new TouchBarLabel();
      this.fpsWarning = new TouchBarLabel();

      bar.push(
        new TouchBarSpacer({ size: 'flexible' }),
        this.fpsValue,
        new TouchBarSpacer({ size: 'small' }),
        this.fpsBars,
        new TouchBarSpacer({ size: 'small' }),
        this.fpsWarning
      );
    }

    this.touchBar = new TouchBar(bar);

    BrowserWindow.getAllWindows().forEach(w => w.setTouchBar(this.touchBar));

    this.update();
  }

  update() {
    // page info
    const pageInformation = this.client.getPlugin('page-information').store;
    this.pageInfo.label = truncate(pageInformation.get('title'), 20);

    // fps
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
