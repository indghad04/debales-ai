const mongoose = require('mongoose');

process.env.NODE_OPTIONS = '--no-experimental-fetch';

const uri = 'mongodb://inghadge4_db_user:q2nQXEISLcE0SZIZ@ac-4xyhiir-shard-00-00.qubdgij.mongodb.net:27017,ac-4xyhiir-shard-00-01.qubdgij.mongodb.net:27017,ac-4xyhiir-shard-00-02.qubdgij.mongodb.net:27017/debales?ssl=true&authSource=admin&retryWrites=true&w=majority';

async function seed() {
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB!');

    const ProjectSchema = new mongoose.Schema({
      name: String, slug: String, description: String
    }, { timestamps: true });

    const UserSchema = new mongoose.Schema({
      name: String, email: String, role: String,
      projectId: mongoose.Schema.Types.ObjectId
    }, { timestamps: true });

    const DashboardSchema = new mongoose.Schema({
      projectId: mongoose.Schema.Types.ObjectId,
      title: String,
      sections: mongoose.Schema.Types.Mixed
    }, { timestamps: true });

    const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    const DashboardConfig = mongoose.models.DashboardConfig || mongoose.model('DashboardConfig', DashboardSchema);

    await Project.deleteMany({});
    await User.deleteMany({});
    await DashboardConfig.deleteMany({});
    console.log('🗑️ Cleared existing data!');

    const project = await Project.create({
      name: 'Debales AI',
      slug: 'debales-ai',
      description: 'AI Sales Assistant Platform'
    });
    console.log('✅ Project created:', project.name);

    const admin = await User.create({
      name: 'Indraja Ghadge',
      email: 'admin@debales.ai',
      role: 'admin',
      projectId: project._id
    });
    console.log('✅ Admin created:', admin.email);

    const member = await User.create({
      name: 'John Member',
      email: 'member@debales.ai',
      role: 'member',
      projectId: project._id
    });
    console.log('✅ Member created:', member.email);

    await DashboardConfig.create({
      projectId: project._id,
      title: 'Debales AI Dashboard',
      sections: [
        {
          id: 'overview',
          title: 'Overview',
          order: 0,
          widgets: [
            { id: 'total-users', type: 'stat', title: 'Total Users', value: '1,234', description: 'Active users this month', order: 0, visible: true },
            { id: 'total-conversations', type: 'stat', title: 'Total Conversations', value: '5,678', description: 'Conversations this month', order: 1, visible: true },
            { id: 'revenue', type: 'stat', title: 'Revenue', value: '$12,345', description: 'Revenue this month', order: 2, visible: true }
          ]
        },
        {
          id: 'analytics',
          title: 'Analytics',
          order: 1,
          widgets: [
            { id: 'chat-volume', type: 'chart', title: 'Chat Volume', description: 'Daily chat volume trend', order: 0, visible: true },
            { id: 'system-alert', type: 'alert', title: 'System Status', value: 'All systems operational', description: 'Last checked 5 mins ago', order: 1, visible: true }
          ]
        }
      ]
    });
    console.log('✅ Dashboard config created!');

    console.log('\n🎉 Seeding complete!');
    console.log('📧 Admin: admin@debales.ai');
    console.log('📧 Member: member@debales.ai');
    console.log('🏢 Project slug: debales-ai');
    process.exit(0);

  } catch(err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();