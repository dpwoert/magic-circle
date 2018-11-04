class SeedPlugin{

  constructor(client){
    this.client = client;
    this.seed = 0;
    this.generateSeed();

    // Setup client
    this.client.generateSeed = this.generateSeed.bind(this);
    this.client.getSeed = this.getSeed.bind(this);
  }

  connect(){
    this.client.sendMessage('seed', this.seed);

    // Event listeners
    this.client.addListener('generate-seed', () => {
      this.generateSeed();
    });
  }

  getSeed(){
    return this.seed;
  }

  generateSeed(){
    this.seed = Math.random();
    this.client.sendMessage('seed', this.seed);
  }

}

export default SeedPlugin;
