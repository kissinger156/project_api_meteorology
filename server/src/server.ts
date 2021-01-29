import './utils/modules-alias';
import { Server } from '@overnightjs/core';
import express, { Application } from 'express';
import { ForecastController } from './controllers/forecastController';
import * as database from './database';

export class SetupServer extends Server {
  //definindo a porta direto no construtor, dessa forma terá uma instância this.port disponível por toda a classe para ser acessada
  constructor(private port = 3333) {
    super();
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.databaseSetup();
  }

  //fazendo a configuração do express, esse comando basicamente é a mesma coisa de usar por exemplo, server.uso(express.json())
  private setupExpress(): void {
    this.app.use(express.json());
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    this.addControllers([forecastController]);
  }

  public async close(): Promise<void> {
    await database.close();
  };

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public getApp(): Application {
    return this.app;
  }
}
