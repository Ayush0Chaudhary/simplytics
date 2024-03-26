import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { log } from 'console';
// import { accessSync } from 'fs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(code: string) {
    if (code === undefined) {
      throw new Error('Github  auth failed you bruh');
    }
    const githubID = await this.getEmailFromGithub(code);
    if (githubID === undefined) {
      return undefined;
    }
    try {
      return githubID;
    } catch (err) {
      log('Login Failed', err.message);
    }
  }

  async getEmailFromGithub(code: string) {
    const githubAuthUrl = 'https://github.com/login/oauth/access_token';
    const values = {
      code,
      client_id: process.env.GITHUB_OAUTH_CLIENTID,
      client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URL,
      // grant_type: 'authorization_code',
    };
    try {
      // log('Autherization_Code : ', code);
      const response = await axios.post(githubAuthUrl, values, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      // log(response);

      const access_token = response.data.split('&')[0].split('=')[1];
      // const id_token = response.data.split('&')[1];
      log('access_token@@@@@@@@@@@@@@@@@@@', access_token);
      try {
        // if(access_token !==)
        if (access_token.startsWith('gho')) {
          const githubUser = await axios.get(`https://api.github.com/user`, {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });

          console.log('github_user@@@@@@@@@@@@', githubUser);
          const payload = {
            sub: githubUser.data.id,
            username: githubUser.data.login,
          };

          return {
            access_token: await this.jwtService.signAsync(payload),
          };
        }
      } catch (err) {
        log(err.message, ':: error-Failed to get email from google');
      }
    } catch (err) {
      log(err, ':: error-Failed to get id_token');
    }
  }
}
