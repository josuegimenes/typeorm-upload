import fs from 'fs';
import AppError from '../errors/AppError';

interface Response {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(path: string): Promise<Response[]> {
    const fileExists = await fs.promises.stat(path);

    if (!fileExists) {
      throw new AppError('File does not exists!');
    }

    const Response: Response[] = [];

    const file = fs.readFileSync(path, 'utf-8');

    const fileLine = file.split('\n');

    const linesData = fileLine.splice(1, fileLine.length - 2);

    linesData.map(line => {
      const newData = line.split(', ');
      const transaction: Response = {
        title: newData[0],
        type: newData[1] === 'income' ? 'income' : 'outcome',
        value: Number(newData[2]),
        category: newData[3],
      };

      Response.push(transaction);

      return true;
    });

    return Response;
  }
}

export default ImportTransactionsService;
