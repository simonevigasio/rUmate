import { createRouter, createWebHistory } from 'vue-router';

// Import components
import RegistrationForm from '../components/RegistrationForm.vue'
import LoginForm from '../components/LoginForm.vue'
import VisualizationAd from '../components/VisualizationAd.vue'
import PubblicationAd from '../components/PubblicationAd.vue'

const routes = [
  { path: '/', component: VisualizationAd },
  { path: '/signin', component: RegistrationForm},
  { path: '/login', component: LoginForm },
  { path: '/publishAd', component: PubblicationAd }
];

export default createRouter({ history: createWebHistory(), routes })
