import { createRouter, createWebHistory } from 'vue-router';

// Import components
import RegistrationForm from '../components/RegistrationForm.vue'
import LoginForm from '../components/LoginForm.vue'
import VisualizationAd from '../components/VisualizationAd.vue'
import AdSelection from '../components/AdSelection.vue'
import PersonalSection from '../components/PersonalSection.vue'
import VisualizationChat from '../components/VisualizationChat.vue'

const routes = [
  { path: '/', component: VisualizationAd },
  { path: '/advertisement', component: AdSelection },
  { path: '/signin', component: RegistrationForm},
  { path: '/login', component: LoginForm },
  { path: '/personalSection', component: PersonalSection },
  { path: '/chat', component: VisualizationChat },
];

const router = createRouter({ history: createWebHistory(), routes: routes });

export default router 
