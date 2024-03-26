import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
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
      return 'Github  auth failed you bruh';
    }
    return githubID;
  }

  async getEmailFromGithub(code: string) {
    const githubAuthUrl = 'https://github.com/login/oauth/access_token';
    const values = {
      code,
      client_id: process.env.GITHUB_OAUTH_CLIENTID,
      client_secret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URL,
    };
    try {
      const response = await axios.post(githubAuthUrl, values, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      const access_token = response.data.split('&')[0].split('=')[1];
      try {
        if (access_token.startsWith('gho')) {
          const githubUser = await axios.get(`https://api.github.com/user`, {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          });

          const payload = {
            sub: githubUser.data.id,
            username: githubUser.data.login,
          };

          return {
            access_token: await this.jwtService.signAsync(payload),
          };
        }
      } catch (err) {
        return err.message;
      }
    } catch (err) {
      return err.message;
    }
  }
}
