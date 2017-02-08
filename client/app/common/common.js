import angular from 'angular';
import Navbar from './navbar/navbar';
import Hero from './hero/hero';
import User from './user/user';
import Amber from './amber/amber';

let commonModule = angular.module('app.common', [
  Navbar,
  Hero,
  User,
  Amber
])
  
.name;

export default commonModule;
