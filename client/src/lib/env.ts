import { env } from '$env/dynamic/public';
import z from 'zod';

const environmentSchema = z.object({
  PUBLIC_BASE_URL: z.string().url().optional(),
});

let parsedEnvironment: z.infer<typeof environmentSchema>;

try {
  parsedEnvironment = environmentSchema.parse(env)
} catch (error: unknown) {
  if (error instanceof z.ZodError) {
    console.error("Environment validation failed:")
    error.errors.map((err) => {
      console.error(err);
    })
  }
  throw error
}

const environment = {
  ...env,
  get PUBLIC_BASE_URL () {
    return parsedEnvironment.PUBLIC_BASE_URL ? new URL(parsedEnvironment.PUBLIC_BASE_URL) : undefined;
  }
}

export default environment;