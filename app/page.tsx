import { callProducts } from ‘@/aws_db/db’;

export async function fetchProducts() {

try {

const response = await callProducts(“SELECT * FROM products”, []);

const data = JSON.stringify(response);

return data;

}

catch (error) {

console.log(error);

throw new Error(‘Failed to fetch revenue data.’);

}

}

export default function Home() {
  return (
    <div>
      <h1>This is the home page</h1>
    </div>
  );
}
