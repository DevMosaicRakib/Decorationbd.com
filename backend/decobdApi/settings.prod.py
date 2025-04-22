from datetime import timedelta
from pathlib import Path
import os
# from dotenv import load_dotenv


# # Load environment variables from .env file
#  load_dotenv()

from os import environ

import environ 



# Initialize environment variables
env = environ.Env()
environ.Env.read_env()  # Read .env file




# Build paths inside the project like this: BASE_DIR / 'subdir'.

BASE_DIR = Path(__file__).resolve().parent.parent


# SECURITY WARNING: keep the secret key used in production secret!

SECRET_KEY = 'd=gzhdqsj4q#g8nl$62w-rmyloj5snceveu0q)%b(!++yr^d_1'

# SECRET_KEY = env('SECRET_KEY')


# SECURITY WARNING: don't run with debug turned on in production!

DEBUG = True

ALLOWED_HOSTS = ['*']


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'ckeditor',
    'rest_framework',
    'rest_framework_simplejwt',
    'Users',
    'CategoryAndSubcategory',
    'Products',
    'Slider',
    'customerSection',
    'Cart',
    'Orders',
    'Coupon',
    'EmailTemplate',
    'HomePage',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'decobdApi.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'decobdApi.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.0/ref/settings/#databases



DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'mbdb/db.sqlite3',

        # 'NAME':   os.path.join(BASE_DIR, 'mbdb/db.sqlite3')

        #  os.path.join(BASE_DIR, 'db.sqlite3')

    }
}




# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql_psycopg2',
#         'NAME': 'myproject',
#         'USER': 'myprojectuser',
#         'PASSWORD': 'password',
#         'HOST': 'localhost',
#         'PORT': '5432',
#     }
# }









# JWT Configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

# Password validation
# https://docs.djangoproject.com/en/4.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.0/topics/i18n/

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.0/howto/static-files/

# STATIC_URL = 'static/'
# STATIC_ROOT = BASE_DIR / "staticfiles"
# # STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
# MEDIA_URL = '/media/'
# MEDIA_ROOT = os.path.join(BASE_DIR,'media')


STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'static'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'




# STATIC_URL = 'static/'

# # Default primary key field type
# # https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

# DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# import os
# STATIC_ROOT = os.path.join(BASE_DIR, 'static/')





# Default primary key field type
# https://docs.djangoproject.com/en/4.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
AUTH_USER_MODEL = 'Users.User'



# JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=14400),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'TOKEN_USER_CLASS': 'rest_framework_simplejwt.models.TokenUser',
    'JTI_CLAIM': 'jti',

}

PASSWORD_RESET_TIMEOUT=300          # 300 Sec = 5 Min

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",


    "https://react.decorationbd.com",
    "http://react.decorationbd.com",

    "http://react1.decorationbd.com",
    "https://react1.decorationbd.com",

    "http://react2.decorationbd.com",
    "https://react2.decorationbd.com"


]

#### Bkash Test/Demo

# BKASH_APP_KEY = '4f6o0cjiki2rfm34kfdadl1eqq'
# BKASH_APP_SECRET = '2is7hdktrekvrbljjh44ll3d9l1dtjo4pasmjvs5vl5qr3fug4b'
# BKASH_USERNAME = 'sandboxTokenizedUser02'
# BKASH_PASSWORD = 'sandboxTokenizedUser02@12345'
# BKASH_SANDBOX = True
# BKASH_BASE_URL = 'https://tokenized.sandbox.bka.sh/v1.2.0-beta'


#### Bkash Live 

# BKASH_APP_KEY = 'Gh2xlohDeM7HyoywOeIOlvDLtc'
# BKASH_APP_SECRET = 'egzgh8VyNnDHEEX0QPVzFldWm72lVVe5YubjitVofiDiQXchkRr3'
# BKASH_USERNAME = '01972846794'
# BKASH_PASSWORD = 'P9i2!+e$|E@'
# BKASH_SANDBOX = False
# BKASH_BASE_URL = 'https://tokenized.pay.bka.sh/v1.2.0-beta'



BKASH_APP_KEY = env('APP_KEY')
BKASH_APP_SECRET = env('APP_SECRET')
BKASH_USERNAME = env('USERNAME')
BKASH_PASSWORD = env('PASSWORD')
BKASH_SANDBOX = env('SANDBOX')
BKASH_BASE_URL = env('BASE_URL')





# # send email configaration
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = 'smtp.gmail.com'
# EMAIL_PORT = 587
# EMAIL_USE_TLS = True
# DEFAULT_FROM_EMAIL = "Decorationbd"
# EMAIL_HOST_USER = "rakibhasan2222222@gmail.com"
# EMAIL_HOST_PASSWORD = "ryjngszaumoiqdcl"




# send email configaration
EMAIL_BACKEND = env('EMAIL_BACKEND')
EMAIL_HOST = env('EMAIL_HOST')
EMAIL_PORT = env('EMAIL_PORT')
EMAIL_USE_TLS = env('EMAIL_USE_TLS')
DEFAULT_FROM_EMAIL = env('DEFAULT_FROM_EMAIL')
EMAIL_HOST_USER = env('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = env('EMAIL_HOST_PASSWORD')




CKEDITOR_UPLOAD_PATH = 'uploads/'









