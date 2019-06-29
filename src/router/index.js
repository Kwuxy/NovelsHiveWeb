import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '../components/HelloWorld'
import Register from '../components/Register'
import Login from '../components/Login'
import ReadChapter from '../components/ReadChapter'
import NovelWriter from '../components/NovelWriter'
import auth from '../middleware/auth'
import StoryCreator from '../components/StoryCreator'
import Account from '../components/Account'
import MyStories from '../components/MyStories'
import SearchStory from '../components/SearchStory'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
      meta: {
        middleware: auth
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/write',
      name: 'NovelWriter',
      component: NovelWriter,
      meta: {
        middleware: auth
      }
    },
    {
      path: '/create-story',
      name: 'createStory',
      component: StoryCreator,
      meta: {
        middleware: auth
      }
    },
    {
      path: '/account',
      name: 'Account',
      component: Account,
      meta: {
        middleware: auth
      }
    },
    {
      path: '/my-stories',
      name: 'my-stories',
      component: MyStories,
      meta: {
        middleware: auth
      }
    },
    {
      path: '/read/:id',
      name: 'read',
      component: ReadChapter,
      meta: {
        middleware: auth
      }
    },
    {
      path: '/search',
      name: 'Search',
      component: SearchStory,
      meta: {
        middleware: auth
      }
    }

  ]
})

function nextFactory (context, middleware, index) {
  const subsequentMiddleware = middleware[index]
  // If no subsequent Middleware exists,
  // the default `next()` callback is returned.
  if (!subsequentMiddleware) return context.next

  return (...parameters) => {
    // Run the default Vue Router `next()` callback first.
    context.next(...parameters)
    // Then run the subsequent Middleware with a new
    // `nextMiddleware()` callback.
    const nextMiddleware = nextFactory(context, middleware, index + 1)
    subsequentMiddleware({ ...context, next: nextMiddleware })
  }
}

router.beforeEach((to, from, next) => {
  if (to.meta.middleware) {
    const middleware = Array.isArray(to.meta.middleware)
      ? to.meta.middleware
      : [to.meta.middleware]

    const context = {
      from,
      next,
      router,
      to
    }
    const nextMiddleware = nextFactory(context, middleware, 1)

    return middleware[0]({ ...context, next: nextMiddleware })
  }

  return next()
})

export default router
