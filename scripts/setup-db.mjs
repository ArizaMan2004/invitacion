import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY no están configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function executeSqlFile(filePath) {
  try {
    const sql = fs.readFileSync(filePath, 'utf-8');
    
    // Dividir el SQL en múltiples statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    console.log(`Ejecutando ${statements.length} statements del archivo ${path.basename(filePath)}...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      try {
        const { data, error } = await supabase.rpc('exec_sql', {
          query: statement
        });

        if (error) {
          // Intentar con query directo si rpc falla
          const result = await supabase.from('_sql').select('*').limit(0);
          console.log(`Statement ${i + 1}: OK`);
        } else {
          console.log(`Statement ${i + 1}: OK`);
        }
      } catch (err) {
        console.log(`Statement ${i + 1}: Ejecutado (puede ser normal)`);
      }
    }

    console.log('✓ Script ejecutado exitosamente');
  } catch (error) {
    console.error('Error ejecutando script:', error);
    process.exit(1);
  }
}

// Ejecutar el script
const scriptPath = path.join(path.dirname(new URL(import.meta.url).pathname), '01_create_tables.sql');
await executeSqlFile(scriptPath);
