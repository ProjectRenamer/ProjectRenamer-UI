import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';

const homeRoutes: Routes = [
  { path: '', component: HomePageComponent }
];

export const homeRouter = RouterModule.forChild(homeRoutes);

