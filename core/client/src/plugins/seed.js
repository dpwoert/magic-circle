class SeedPlugin {
  constructor(client) {
    this.client = client;
    this.seed = 0;
    this.generateSeed();

    // Setup client
    this.client.generateSeed = this.generateSeed.bind(this);
    this.client.getSeed = this.getSeed.bind(this);
  }

  connect() {
    this.client.sendMessage('seed', this.seed);

    // Event listeners
    this.client.addListener('generate-seed', () => {
      this.generateSeed();
    });
    this.client.addListener('set-seed', (evt, payload) => {
      this.setSeed(payload);
    });
  }

  getSeed() {
    return this.seed;
  }

  setSeed(seed) {
    this.seed = seed;
  }

  generateSeed() {
    this.seed = Math.random();
    this.client.sendMessage('seed', this.seed);
  }
}

export default SeedPlugin;
