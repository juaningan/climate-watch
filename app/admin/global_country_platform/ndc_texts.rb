ActiveAdmin.register_page 'Global Cw Platform Ndc Texts' do
  section_name = 'ndc_texts'
  platform_name = 'global_cw_platform'

  menu parent: 'Climate Watch Global', label: section_name.split('_').map(&:capitalize).join(' ')

  content do
    render partial: 'admin/form_upload_ndc_texts', locals: {
      datasets: Admin::Dataset.joins(:section).
        where(sections: {name: section_name}).
        where(sections: {platform_id: Admin::Platform.find_by(name: platform_name).id}),
      upload_path: admin_global_cw_platform_ndc_texts_upload_datafile_path,
      download_path: admin_global_cw_platform_ndc_texts_download_datafiles_path
    }
  end

  page_action :upload_datafile, method: :post do
    dataset = Admin::Dataset.find(params[:dataset_id])

    dataset.datafile.attach(params[:datafile])
    Admin::UnzipAndUpload.call('test/test2', dataset.datafile.attachment)

    notice = 'Uploaded succesfully!'
    redirect_to admin_global_cw_platform_ndc_texts_path, notice: notice
  end

  page_action :download_datafiles, method: :post do
    datasets = Admin::Dataset.joins(:section).
      where(sections: {name: section_name}).
      where(sections: {platform_id: Admin::Platform.find_by(name: platform_name).id})

    datafiles = datasets.map(&:datafile).map(&:attachment).compact
    datafiles.empty? && return

    zip_filename = 'archive'

    Admin::S3Downloader.call([], 'test/test2')

    File.open("tmp_dir/#{zip_filename}.zip", 'r') do |f|
      send_data f.read.force_encoding('BINARY'),
                filename: "#{zip_filename}.zip",
                type: 'application/zip',
                disposition: 'attachment'
    end

    FileUtils.rm_rf('tmp_dir')
  end
end
