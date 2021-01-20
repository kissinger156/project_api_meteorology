import './utils/modules-alias';
import { Server } from '@overnightjs/core';
import express, { Application } from 'express';
import { ForecastController } from './controllers/forecastController';

export class SetupServer extends Server {
  //definindo a porta direto no construtor, dessa forma terá uma instância this.port disponível por toda a classe para ser acessada
  constructor(private port = 3333) {
    super();
  }

  public init(): void {
    this.setupExpress();
    this.setupControllers();
  }

  //fazendo a configuração do express, esse comando basicamente é a mesma coisa de usar por exemplo, server.uso(express.json())
  private setupExpress(): void {
    this.app.use(express.json());
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    this.addControllers([forecastController]);
  }

  public getApp(): Application {
    return this.app;
  }
}
